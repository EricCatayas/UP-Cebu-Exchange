import ArtworkRepository from '@/repositories/ArtworkRepository';
import ImageService from '@/services/ImageService';
import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Artwork, Artist, ArtworkImage, ArtworkTag, RentalPlan, Tag, Style } from '@/models/sequelize';
import { ArtworkCreateDTO } from '@/models/Artwork';
import { getCurrentUser, isAdmin, canEditContent } from '@/lib/auth';
import { ARTWORK_STATUS } from '@/lib/constants';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication and admin authorization
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    if (!canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Admin editor access required' }, { status: 403 });
    }

    const artworkId = parseInt((await params).id);

    const formData = await request.formData();

    const title = formData.get('title') as string;
    const artistId = formData.get('artistId') ? Number(formData.get('artistId')) : undefined;
    const artistName = formData.get('artistName') as string;
    const styleId = formData.get('styleId') ? Number(formData.get('styleId')) : undefined;
    const styleName = formData.get('styleName') as string;
    const description = formData.get('description') as string;
    const medium = formData.get('medium') as string;
    const heightCm = formData.get('heightCm') ? Number(formData.get('heightCm')) : undefined;
    const widthCm = formData.get('widthCm') ? Number(formData.get('widthCm')) : undefined;
    const status = formData.get('status') as string;
    const images = formData.getAll('images') as File[];
    const primaryImageId = formData.get('primaryImageId') as string;
    const rentalFee3Months = Number(formData.get('rentalFee3Months'));
    const rentalFee6Months = Number(formData.get('rentalFee6Months'));
    const rentalFee12Months = Number(formData.get('rentalFee12Months'));
    const tagsString = formData.get('tags') as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];

    const artwork = await Artwork.findByPk(artworkId, {
      include: [
        { model: Artist, as: 'artist' },
        { model: Style, as: 'style' },
        { model: ArtworkImage, as: 'images' },
        { model: RentalPlan, as: 'rentalPlans' },
        'tags',
      ],
    });

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!medium) {
      return NextResponse.json({ error: 'Medium is required' }, { status: 400 });
    }

    if (!rentalFee3Months || !rentalFee6Months || !rentalFee12Months) {
      return NextResponse.json({ error: 'Rental fees are required' }, { status: 400 });
    }

    if ((!artwork.images || artwork.images.length === 0) && images.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
    } else if (images && images.length > 0) {
      for (const image of images) {
        if (!image.type.startsWith('image/')) {
          return NextResponse.json({ error: 'All uploaded files must be image type' }, { status: 400 });
        }
      }
    }

    if (isNaN(Number(heightCm)) || isNaN(Number(widthCm))) {
      return NextResponse.json({ error: 'Height and width must be valid numbers' }, { status: 400 });
    }

    if (Number(heightCm) <= 0 || Number(widthCm) <= 0) {
      return NextResponse.json({ error: 'Height and width must be positive numbers' }, { status: 400 });
    }

    let artworkArtistId = null;

    if (artistId) {
      // Check if artist exists
      const artist = await Artist.findByPk(artistId);
      if (!artist) {
        return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
      } else {
        artworkArtistId = artist.id;
      }
    } else if (artistName) {
      const newArtist = await Artist.create({ name: artistName });
      artworkArtistId = newArtist.id;
    }

    let artworkStyleId = styleId;

    if (!styleId && styleName) {
      const newStyle = await Style.create({ name: styleName });
      artworkStyleId = newStyle.id;
    }

    // Update artwork
    await artwork.update({
      title: title?.trim(),
      artistId: artworkArtistId || undefined,
      styleId: artworkStyleId,
      description: description?.trim(),
      medium: medium?.trim(),
      heightCm: heightCm,
      widthCm: widthCm,
      status: status,
    });

    // Update rental plans
    const rentalPlans = artwork.rentalPlans as RentalPlan[];
    for (const plan of rentalPlans) {
      if (plan.durationMonths === 3) {
        await plan.update({ price: rentalFee3Months });
      } else if (plan.durationMonths === 6) {
        await plan.update({ price: rentalFee6Months });
      } else if (plan.durationMonths === 12) {
        await plan.update({ price: rentalFee12Months });
      }
    }

    // Update tags
    const existingTags = artwork.tags as Tag[];
    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = tags;
    // Add new tags
    for (const tagName of newTagNames) {
      if (!existingTagNames.includes(tagName)) {
        const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
        await ArtworkTag.create({ artworkId: artwork.id, tagId: tag.id });
      }
    }
    // Delete removed tags
    for (const existingTag of existingTags) {
      if (!newTagNames.includes(existingTag.name)) {
        await ArtworkTag.destroy({
          where: {
            artworkId: artwork.id,
            tagId: existingTag.id,
          },
        });
      }
    }

    // Handle image uploads
    const arrayBuffers = await Promise.all(images.map((file) => file.arrayBuffer()));
    const buffers = arrayBuffers.map((buffer) => {
      return new Uint8Array(buffer);
    });

    const imageService = new ImageService();
    const { success: imageUploadSuccess, results: imageUploadResults } = await imageService.uploadImages(buffers);

    if (imageUploadSuccess) {
      for (let i = 0; i < imageUploadResults!.length; i++) {
        const result = imageUploadResults![i];
        await ArtworkImage.create({
          id: result.public_id,
          artworkId: artworkId,
          imageUrl: result.secure_url,
          isPrimary: String(i) === primaryImageId,
        });
      }
    }

    const primaryImage = artwork.images?.find((img) => img.id === primaryImageId);
    if (primaryImage) {
      await ArtworkImage.update(
        { isPrimary: false },
        { where: { artworkId: artworkId, id: { [Op.ne]: primaryImageId } } }
      );
      primaryImage.isPrimary = true;
      await primaryImage.save();
    }

    return NextResponse.json(
      {
        message: 'Artwork updated successfully',
        artwork: artwork.toJSON(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Artwork creation error:', error);

    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      return NextResponse.json({ error: 'Validation error: ' + error.message }, { status: 400 });
    }

    if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
      return NextResponse.json({ error: 'Invalid artist reference' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// TODO: Test API
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication and admin authorization
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (!isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    if (!canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Admin editor access required' }, { status: 403 });
    }

    const artworkId = parseInt((await params).id);

    if (!artworkId || isNaN(Number(artworkId))) {
      return NextResponse.json({ error: 'Valid artworkId is required' }, { status: 400 });
    }
    // Find the artwork
    const artwork = await Artwork.findByPk(artworkId, { include: ['images'] });
    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const imageService = new ImageService();
    const artworkImages = await artwork.images;
    for (const image of artworkImages) {
      await imageService.deleteImage(image.id);
    }

    // Delete the artwork
    await artwork.destroy();
    return NextResponse.json({ message: 'Artwork deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Artwork deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

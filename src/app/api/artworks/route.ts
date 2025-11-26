import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Artwork, Artist, ArtworkImage, ArtworkTag, RentalPlan, Tag, Style } from '@/models/sequelize';
import { ArtworkCreateDTO } from '@/models/Artwork';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { ARTWORK_STATUS } from '@/lib/constants';

// TODO: Test API
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin authorization
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();

    const images = formData.getAll('images') as File[];
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
    const rentalFee3Months = Number(formData.get('rentalFee3Months'));
    const rentalFee6Months = Number(formData.get('rentalFee6Months'));
    const rentalFee12Months = Number(formData.get('rentalFee12Months'));

    const tagsString = formData.get('tags') as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];

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

    if (images && images.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
    } else {
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

    // Create artwork
    const createdArtwork = await Artwork.create({
      title: title?.trim(),
      artistId: artworkArtistId || undefined,
      styleId: artworkStyleId,
      description: description?.trim(),
      medium: medium.trim(),
      heightCm: Number(heightCm),
      widthCm: Number(widthCm),
      status: status,
    });

    // Handle image uploads
    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      // TODO: Upload to Cloudinary
      // For now, using placeholder
      const imageUrl =
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763972672/UP%20Cebu%20Exchange/placeholder-img-1x1_ihvqvy.png';

      await ArtworkImage.create({
        artworkId: createdArtwork!.id,
        imageUrl: imageUrl,
        isPrimary: i === 0,
      });
    }

    await RentalPlan.bulkCreate([
      { artworkId: createdArtwork!.id, durationMonths: 3, price: rentalFee3Months },
      { artworkId: createdArtwork!.id, durationMonths: 6, price: rentalFee6Months },
      { artworkId: createdArtwork!.id, durationMonths: 12, price: rentalFee12Months },
    ]);

    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        let tag = await Tag.findOrCreate({ where: { name: tagName } });
        await ArtworkTag.create({ artworkId: createdArtwork!.id, tagId: tag[0].id });
      }
    }

    return NextResponse.json(
      {
        message: 'Artwork created successfully',
        artwork: {
          id: createdArtwork!.id,
          title: createdArtwork!.title,
          artistId: createdArtwork!.artistId,
          artist: (createdArtwork as any).artist || null,
          description: createdArtwork!.description,
          medium: createdArtwork!.medium,
          heightCm: createdArtwork!.heightCm,
          widthCm: createdArtwork!.widthCm,
          status: createdArtwork!.status,
          createdAt: createdArtwork!.createdAt,
          updatedAt: createdArtwork!.updatedAt,
          tags: tags || [],
        },
      },
      { status: 201 }
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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const artistId = searchParams.get('artistId');
    const search = searchParams.get('search');

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100',
        },
        { status: 400 }
      );
    }

    // Build where clause
    const whereClause: any = {};

    if (status !== null && status !== undefined) {
      whereClause.status = status === 'true' ? 'available' : 'unavailable';
    }

    if (artistId) {
      whereClause.artistId = parseInt(artistId);
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { medium: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch artworks with pagination
    const { count, rows: artworks } = await Artwork.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Artist,
          as: 'artist',
          attributes: ['id', 'name', 'bio'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      artworks: artworks.map((artwork) => ({
        id: artwork.id,
        title: artwork.title,
        artistId: artwork.artistId,
        artist: (artwork as any).artist || null,
        description: artwork.description,
        medium: artwork.medium,
        heightCm: artwork.heightCm,
        widthCm: artwork.widthCm,
        status: artwork.status,
        createdAt: artwork.createdAt,
        updatedAt: artwork.updatedAt,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error('Artworks fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// TODO: Test API
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication and admin authorization
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (!isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    // Parse request body
    const { artworkId } = await request.json();
    if (!artworkId || isNaN(Number(artworkId))) {
      return NextResponse.json({ error: 'Valid artworkId is required' }, { status: 400 });
    }
    // Find the artwork
    const artwork = await Artwork.findByPk(artworkId);
    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    // TODO: handle deletion of associated images

    // Delete the artwork
    await artwork.destroy();
    return NextResponse.json({ message: 'Artwork deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Artwork deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

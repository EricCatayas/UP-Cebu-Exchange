import ImageService from '@/services/ImageService';
import { NextRequest, NextResponse } from 'next/server';
import { Artwork, ArtworkImage } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';
import { ARTWORK_STATUSES } from '@/lib/constants';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
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
    const { imageId } = await request.json();

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    if (isNaN(Number(artworkId))) {
      return NextResponse.json({ error: 'Artwork ID must be a valid number' }, { status: 400 });
    }

    const artworkImages = await ArtworkImage.findAll({
      where: {
        artworkId: artworkId,
      },
    });

    const artworkImage = artworkImages.find((img) => img.id === imageId);

    if (!artworkImage) {
      return NextResponse.json({ error: 'Artwork image not found' }, { status: 404 });
    }

    const imageService = new ImageService();
    const { success } = await imageService.deleteImage(artworkImage.id);

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete image from storage' }, { status: 500 });
    }

    if (artworkImage.isPrimary) {
      const otherImage = artworkImages.find((img) => img.id !== artworkImage.id);
      if (otherImage) {
        otherImage.isPrimary = true;
        await otherImage.save();
      }
    }
    await artworkImage.destroy();

    return NextResponse.json({ message: 'Artwork image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Artwork status update error:', error);

    // Handle Sequelize validation errors
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      return NextResponse.json({ error: 'Validation error: ' + error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

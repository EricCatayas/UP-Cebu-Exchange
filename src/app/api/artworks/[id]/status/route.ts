import { NextRequest, NextResponse } from 'next/server';
import { Artwork } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';
import { ARTWORK_STATUSES } from '@/lib/constants';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    if (isNaN(Number(artworkId))) {
      return NextResponse.json({ error: 'Artwork ID must be a valid number' }, { status: 400 });
    }

    // Validate status is a valid enum value
    const validStatuses = ARTWORK_STATUSES;
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const artwork = await Artwork.findByPk(artworkId);

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    // Update the order status
    artwork.status = status;
    await artwork.save();

    return NextResponse.json(
      {
        message: 'Artwork status updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Artwork status update error:', error);

    // Handle Sequelize validation errors
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      return NextResponse.json({ error: 'Validation error: ' + error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

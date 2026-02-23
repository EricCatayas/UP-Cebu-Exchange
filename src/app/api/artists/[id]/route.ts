import { NextRequest, NextResponse } from 'next/server';
import { Artist } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const artistId = parseInt((await params).id);

    const artist = await Artist.findByPk(artistId);

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const { name, biography } = await request.json();

    if (name) {
      artist.name = name;
    }
    if (biography) {
      artist.biography = biography;
    }

    await artist.save();

    return NextResponse.json(
      {
        message: 'Artist updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Artist update error:', error);

    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      return NextResponse.json({ error: 'Validation error: ' + error.message }, { status: 400 });
    }

    if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
      return NextResponse.json({ error: 'Invalid artist reference' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const artistId = parseInt((await params).id);

    const artist = await Artist.findByPk(artistId);

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    await artist.destroy();

    return NextResponse.json({ message: 'Artist deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Artist deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

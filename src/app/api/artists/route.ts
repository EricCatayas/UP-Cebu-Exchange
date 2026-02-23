import { NextRequest, NextResponse } from 'next/server';
import { Artist, Artwork } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin, canEditContent } from '@/lib/role';

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
    if (!canEditContent(currentUser)) {
      return NextResponse.json({ error: 'Admin editor access required' }, { status: 403 });
    }

    const { name, biography, artworkIds } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newArtist = await Artist.create({ name, biography });

    // Optionally associate artworks with the new artist
    if (Array.isArray(artworkIds) && artworkIds.length > 0) {
      await Artwork.update({ artistId: newArtist.id }, { where: { id: artworkIds } });
    }

    return NextResponse.json({ message: 'Artist created successfully', artist: newArtist }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}

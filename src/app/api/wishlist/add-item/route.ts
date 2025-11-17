import WishlistService from '@/services/WishlistService';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const { artworkId } = await request.json();

    if (!artworkId || isNaN(Number(artworkId))) {
      return NextResponse.json({ error: 'Valid artworkId is required' }, { status: 400 });
    }
    console.log('Adding artwork to wishlist:', artworkId);
    await WishlistService.addItem(currentUser.userId, Number(artworkId));
    return NextResponse.json({ message: 'Artwork added to wishlist' }, { status: 200 });
  } catch (error) {
    console.error('Error adding artwork to wishlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

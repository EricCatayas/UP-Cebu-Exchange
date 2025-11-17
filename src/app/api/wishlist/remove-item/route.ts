import WishlistService from '@/services/WishlistService';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const { wishlistItemId } = await request.json();
    if (!wishlistItemId || isNaN(Number(wishlistItemId))) {
      return NextResponse.json({ error: 'Valid wishlistItemId is required' }, { status: 400 });
    }
    await WishlistService.removeItem(currentUser.userId, Number(wishlistItemId));
    return NextResponse.json({ message: 'Artwork removed from wishlist' }, { status: 200 });
  } catch (error) {
    console.error('Error removing artwork from wishlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

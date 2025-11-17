import WishlistService from '@/services/WishlistService';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const wishlistItems = await WishlistService.getWishlistItems(currentUser.userId);

    return NextResponse.json({ wishlistItems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

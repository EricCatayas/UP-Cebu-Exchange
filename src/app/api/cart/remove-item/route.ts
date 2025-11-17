import CartService from '@/services/CartService';
import { getCurrentUser, isAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
    }
    const { artworkId } = await request.json();
    if (!artworkId || isNaN(Number(artworkId))) {
      return new Response(JSON.stringify({ error: 'Valid artworkId is required' }), { status: 400 });
    }

    await CartService.removeItem(currentUser.userId, Number(artworkId));

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

import CartService from '@/services/CartService';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
    }

    const cartItems = await CartService.getCartItems(currentUser.userId);

    return new Response(JSON.stringify({ cartItems }), { status: 200 });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

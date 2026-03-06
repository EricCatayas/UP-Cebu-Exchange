import CartService from '@/services/CartService';
import { getCurrentUser } from '@/lib/auth';
import { isCustomer } from '@/lib/role';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
    }
    if (!isCustomer(currentUser)) {
      return new Response(JSON.stringify({ error: 'Customer access required' }), { status: 403 });
    }

    const { cartId, items } = await CartService.getCartItems(currentUser.userId);

    return new Response(JSON.stringify({ cartId, items }), { status: 200 });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
    }
    if (!isCustomer(currentUser)) {
      return new Response(JSON.stringify({ error: 'Customer access required' }), { status: 403 });
    }
    const { artworkIds } = await request.json();

    if (!artworkIds || !Array.isArray(artworkIds) || artworkIds.some((id) => isNaN(Number(id)))) {
      return new Response(JSON.stringify({ error: 'Valid artworkIds are required' }), { status: 400 });
    }

    await CartService.addItems(currentUser.userId, artworkIds);
    const { cartId, items } = await CartService.getCartItems(currentUser.userId);

    return new Response(JSON.stringify({ success: true, cartId, items }), { status: 201 });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
    }
    if (!isCustomer(currentUser)) {
      return new Response(JSON.stringify({ error: 'Customer access required' }), { status: 403 });
    }

    const { artworkId } = await request.json();
    if (!artworkId || isNaN(Number(artworkId))) {
      return new Response(JSON.stringify({ error: 'Valid artworkId is required' }), { status: 400 });
    }

    await CartService.removeItem(currentUser.userId, Number(artworkId));
    const { cartId, items } = await CartService.getCartItems(currentUser.userId);

    return new Response(JSON.stringify({ success: true, cartId, items }), { status: 201 });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

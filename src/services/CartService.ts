import RentalOrderService from '@/services/RentalOrderService';
import { Artist, Artwork, ArtworkImage, Cart, CartItem, RentalPlan } from '@/models/sequelize';
import { CartItemDTO, CART_STATUS } from '@/models/CartItem';
import { ARTWORK_STATUS, ORDER_STATUS } from '@/lib/constants';

class CartService {
  async addItem(userId: number, artworkId: number) {
    return this.addItems(userId, [artworkId]);
  }

  async addItems(userId: number, artworkIds: number[]) {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }
    const existingCartItems = await CartItem.findAll({ where: { cartId: cart.id, artworkId: artworkIds } });
    const existingArtworkIds = new Set(existingCartItems.map((item) => item.artworkId));
    const newArtworkIds = artworkIds.filter((id) => !existingArtworkIds.has(id));
    const newCartItems = newArtworkIds.map((artworkId) => ({ cartId: cart.id, artworkId }));
    await CartItem.bulkCreate(newCartItems);
  }

  async removeItem(userId: number, artworkId: number) {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new Error('Cart not found for user');
    }
    const cartItem = await CartItem.findOne({ where: { cartId: cart.id, artworkId } });
    if (!cartItem) {
      throw new Error('Item not found in cart');
    }
    await cartItem.destroy();
  }

  async isItemInCart(userId: number, artworkId: number) {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return false;
    }
    const cartItem = await CartItem.findOne({ where: { cartId: cart.id, artworkId } });
    return !!cartItem;
  }

  async getCartItems(userId: number): Promise<{ cartId: number; items: CartItemDTO[] }> {
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'cartItems',
          include: [
            {
              model: Artwork,
              as: 'artwork',
              include: [
                {
                  model: RentalPlan,
                  as: 'rentalPlans',
                },
                {
                  model: ArtworkImage,
                  as: 'images',
                },
                {
                  model: Artist,
                  as: 'artist',
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return [];
    }

    const rentalOrderService = new RentalOrderService();
    const userOrders = await rentalOrderService.getUserOrders(userId);
    const pendingUserOrders = userOrders.filter((order) => order.status === ORDER_STATUS.PENDING);
    const pendingArtworkIds = new Set<number>();
    pendingUserOrders.forEach((order) => {
      order.items.forEach((item) => {
        pendingArtworkIds.add(item.artworkId);
      });
    });

    false;

    const cartItems = cart.cartItems.map((item) => {
      const cartItem = item.toJSON();
      const artwork = cartItem.artwork;
      const isAvailable = artwork.status === ARTWORK_STATUS.AVAILABLE;
      const isRented = artwork.status === ARTWORK_STATUS.RENTED;
      const hasItemInPendingOrder = pendingArtworkIds.has(item.artworkId);
      return {
        id: cartItem.id,
        cartId: cartItem.cartId,
        artworkId: cartItem.artworkId,
        artwork: artwork,
        createdAt: cartItem.createdAt,
        isAvailable: isAvailable && !hasItemInPendingOrder,
        status: hasItemInPendingOrder
          ? CART_STATUS.PENDING_ORDER_EXISTS
          : isRented
            ? CART_STATUS.RENTED
            : isAvailable
              ? CART_STATUS.AVAILABLE
              : CART_STATUS.UNAVAILABLE,
      };
    });

    return {
      cartId: cart.id,
      items: cartItems,
    };
  }
}

export default new CartService();

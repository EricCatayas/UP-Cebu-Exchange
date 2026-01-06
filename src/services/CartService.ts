import { Artwork, ArtworkImage, Cart, CartItem, RentalPlan } from '@/models/sequelize';
import { CartItemDTO } from '@/models/CartItem';
import { ARTWORK_STATUS } from '@/lib/constants';

class CartService {
  async addItem(userId: number, artworkId: number) {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }
    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, artworkId } });
    if (!cartItem) {
      await CartItem.create({ cartId: cart.id, artworkId });
    }
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

  async getCartItems(userId: number): Promise<CartItemDTO[]> {
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
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return [];
    }
    return cart.cartItems.map((item) => {
      const cartItem = item.toJSON();
      const artwork = cartItem.artwork;
      const isAvailable = artwork.status === ARTWORK_STATUS.AVAILABLE;
      return {
        id: cartItem.id,
        cartId: cartItem.cartId,
        artworkId: cartItem.artworkId,
        artwork: artwork,
        createdAt: cartItem.createdAt,
        isAvailable,
      };
    });
  }
}

export default new CartService();

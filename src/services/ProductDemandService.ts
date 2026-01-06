import { Artwork, Event, WishlistItem, CartItem, RentalOrder, RentalOrderItem } from '@/models/sequelize';
import { EVENT_CATEGORY, EVENT_NAME, ORDER_STATUS } from '@/lib/constants';
import { Op } from 'sequelize';

class ProductDemandService {
  async getArtworkViewCount(artworkId: number): Promise<number> {
    const viewCount = await Event.count({
      where: {
        entity_id: artworkId,
        name: EVENT_NAME.VIEW_ARTWORK,
      },
    });
    return viewCount;
  }
  async getArtworkCartCount(artworkId: number): Promise<number> {
    const cartCount = await CartItem.count({
      where: {
        artworkId: artworkId,
      },
    });
    return cartCount;
  }
  async getArtworkWishlistCount(artworkId: number): Promise<number> {
    const wishlistCount = await WishlistItem.count({
      where: {
        artworkId: artworkId,
      },
    });
    return wishlistCount;
  }
  async getArtworkOrderCount(artworkId: number): Promise<number> {
    const orderCount = await RentalOrder.count({
      include: [
        {
          model: RentalOrderItem,
          as: 'rentalItems',
          where: {
            artworkId: artworkId,
          },
        },
      ],
    });
    return orderCount;
  }
  async getArtworkCompletedOrderCount(artworkId: number): Promise<number> {
    const rentalCount = await RentalOrderItem.count({
      include: [
        {
          model: RentalOrder,
          as: 'rentalOrder',
          where: {
            status: ORDER_STATUS.COMPLETED,
          },
        },
      ],
      where: {
        artworkId: artworkId,
      },
    });
    return rentalCount;
  }
}

export default new ProductDemandService();

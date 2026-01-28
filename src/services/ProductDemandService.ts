import { Artwork, Event, WishlistItem, CartItem, RentalOrder, RentalOrderItem } from '@/models/sequelize';
import { EVENT_CATEGORY, EVENT_NAME, ORDER_STATUS } from '@/lib/constants';
import { Op } from 'sequelize';
import { opTimeframe } from '@/lib/orm';

class PopularityScore {
  rentedCount: number;
  orderCount: number;
  wishlistCount: number;
  cartCount: number;
  viewCount: number;

  constructor(viewCount: number, wishlistCount: number, cartCount: number, orderCount: number, rentedCount: number) {
    this.viewCount = viewCount;
    this.wishlistCount = wishlistCount;
    this.cartCount = cartCount;
    this.orderCount = orderCount;
    this.rentedCount = rentedCount;
  }

  getScore(weights: { [key: string]: number }): number {
    return (
      this.rentedCount * weights.rentedCount +
      this.orderCount * weights.orderCount +
      this.wishlistCount * weights.wishlistCount +
      this.cartCount * weights.cartCount +
      this.viewCount * weights.viewCount
    );
  }
}

class ProductDemandService {
  private timeframe?: string;

  constructor(timeframe?: string) {
    this.timeframe = timeframe;
  }

  // Configurable weights for popularity scoring
  // Ordered from highest to lowest priority
  private weights = {
    rentedCount: 5,
    orderCount: 4,
    wishlistCount: 2,
    cartCount: 2,
    viewCount: 1,
  };

  async getArtworkViewCount(artworkId: number): Promise<number> {
    const viewCount = await Event.count({
      where: {
        entityId: artworkId,
        name: EVENT_NAME.VIEW_ARTWORK,
      },
    });
    return viewCount;
  }
  async getArtworkCartCount(artworkId: number): Promise<number> {
    const cartCount = await Event.count({
      where: {
        entityId: artworkId,
        name: EVENT_NAME.ADD_TO_CART,
      },
    });
    return cartCount;
  }
  async getArtworkWishlistCount(artworkId: number): Promise<number> {
    const wishlistCount = await Event.count({
      where: {
        entityId: artworkId,
        name: EVENT_NAME.ADD_TO_WISHLIST,
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
  async getArtworkRentedCount(artworkId: number): Promise<number> {
    const rentalCount = await RentalOrderItem.count({
      include: [
        {
          model: RentalOrder,
          as: 'rentalOrder',
          where: {
            status: { [Op.in]: [ORDER_STATUS.ONGOING, ORDER_STATUS.TORETURN, ORDER_STATUS.COMPLETED] },
          },
        },
      ],
      where: {
        artworkId: artworkId,
      },
    });
    return rentalCount;
  }

  async getArtworkDemandMetrics(artworkId: number) {
    const [viewCount, cartCount, wishlistCount, orderCount, rentedCount] = await Promise.all([
      this.getArtworkViewCount(artworkId),
      this.getArtworkCartCount(artworkId),
      this.getArtworkWishlistCount(artworkId),
      this.getArtworkOrderCount(artworkId),
      this.getArtworkRentedCount(artworkId),
    ]);
    return {
      viewCount,
      cartCount,
      wishlistCount,
      orderCount,
      rentedCount,
    };
  }

  async getArtworksViewCounts(): Promise<{ [artworkId: number]: number }> {
    const events = await Event.findAll({
      where: {
        name: EVENT_NAME.VIEW_ARTWORK,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
      attributes: ['entityId'],
    });
    const viewCounts: { [artworkId: number]: number } = {};
    events.forEach((event) => {
      const artworkId = event.entityId;
      viewCounts[artworkId] = (viewCounts[artworkId] || 0) + 1;
    });
    return viewCounts;
  }
  async getArtworksCartCounts(): Promise<{ [artworkId: number]: number }> {
    const cartItems = await Event.findAll({
      where: {
        name: EVENT_NAME.ADD_TO_CART,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
      attributes: ['entityId'],
    });
    const cartCounts: { [artworkId: number]: number } = {};
    cartItems.forEach((item) => {
      const artworkId = item.entityId;
      cartCounts[artworkId] = (cartCounts[artworkId] || 0) + 1;
    });
    return cartCounts;
  }
  async getArtworksWishlistCounts(): Promise<{ [artworkId: number]: number }> {
    const wishlistItems = await Event.findAll({
      where: {
        name: EVENT_NAME.ADD_TO_WISHLIST,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
      attributes: ['entityId'],
    });
    const wishlistCounts: { [artworkId: number]: number } = {};
    wishlistItems.forEach((item) => {
      const artworkId = item.entityId;
      wishlistCounts[artworkId] = (wishlistCounts[artworkId] || 0) + 1;
    });
    return wishlistCounts;
  }
  async getArtworksOrderCounts(): Promise<{ [artworkId: number]: number }> {
    const orderItems = await RentalOrderItem.findAll({
      include: [
        {
          model: RentalOrder,
          as: 'rentalOrder',
          where: {
            ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
          },
          attributes: [],
        },
      ],
      attributes: ['artworkId'],
    });
    const orderCounts: { [artworkId: number]: number } = {};
    orderItems.forEach((item) => {
      const artworkId = item.artworkId;
      orderCounts[artworkId] = (orderCounts[artworkId] || 0) + 1;
    });
    return orderCounts;
  }
  async getArtworksRentedCounts(): Promise<{ [artworkId: number]: number }> {
    const rentedItems = await RentalOrderItem.findAll({
      include: [
        {
          model: RentalOrder,
          as: 'rentalOrder',
          where: {
            status: ORDER_STATUS.COMPLETED,
            ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
          },
          attributes: [],
        },
      ],
      attributes: ['artworkId'],
    });
    const rentedCounts: { [artworkId: number]: number } = {};
    rentedItems.forEach((item) => {
      const artworkId = item.artworkId;
      rentedCounts[artworkId] = (rentedCounts[artworkId] || 0) + 1;
    });
    return rentedCounts;
  }

  async getArtworksPopularityScores(limit?: number) {
    const [viewCounts, cartCounts, wishlistCounts, orderCounts, rentedCounts] = await Promise.all([
      this.getArtworksViewCounts(),
      this.getArtworksCartCounts(),
      this.getArtworksWishlistCounts(),
      this.getArtworksOrderCounts(),
      this.getArtworksRentedCounts(),
    ]);

    // Get all artworks
    const artworks = await Artwork.findAll({
      include: ['artist', 'images'],
    });

    const popularityScores: { [artworkId: number]: PopularityScore } = {};

    artworks.forEach((artwork) => {
      const artworkId = artwork.id;
      popularityScores[artworkId] = new PopularityScore(
        viewCounts[artworkId] || 0,
        wishlistCounts[artworkId] || 0,
        cartCounts[artworkId] || 0,
        orderCounts[artworkId] || 0,
        rentedCounts[artworkId] || 0
      );
    });

    const artworksWithScores = artworks.map((artwork) => {
      const artworkId = artwork.id;
      const score = popularityScores[artworkId].getScore(this.weights);
      return {
        ...artwork.toJSON(),
        popularityScore: score,
      };
    });

    const sorted = artworksWithScores.sort((a, b) => b.popularityScore - a.popularityScore);

    return {
      artworks: limit ? sorted.slice(0, limit) : sorted,
      popularityScores: popularityScores,
    };
  }
}

export default ProductDemandService;

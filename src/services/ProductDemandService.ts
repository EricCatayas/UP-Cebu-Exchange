import { Artwork, Event, WishlistItem, CartItem, RentalOrder, RentalOrderItem } from '@/models/sequelize';
import { EVENT_CATEGORY, EVENT_NAME, ORDER_STATUS } from '@/lib/constants';
import { Op } from 'sequelize';
import { PopularityScore } from '@/types/analytics';
import { opTimeframe } from '@/lib/orm';
import { calculatePopularityScore } from '@/lib/analytics';

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

  async getArtworksPopularityScores({ page, limit, sort }: { page?: number; limit?: number; sort?: string }) {
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
      popularityScores[artworkId] = {
        viewCount: viewCounts[artworkId] || 0,
        cartCount: cartCounts[artworkId] || 0,
        wishlistCount: wishlistCounts[artworkId] || 0,
        orderCount: orderCounts[artworkId] || 0,
        rentedCount: rentedCounts[artworkId] || 0,
      };
    });

    const artworksWithScores = artworks.map((artwork) => {
      const artworkId = artwork.id;
      const score = calculatePopularityScore(popularityScores[artworkId], this.weights);
      return {
        ...artwork.toJSON(),
        popularityScore: score,
      };
    });

    const orderedArtworks =
      sort && sort === 'popular'
        ? artworksWithScores.sort((a, b) => b.popularityScore - a.popularityScore)
        : artworksWithScores;

    const previousPage = page && limit && page > 1 ? page - 1 : undefined;
    const paginatedArtworks = page && limit ? orderedArtworks.slice((page - 1) * limit, page * limit) : orderedArtworks;
    const pageSize = paginatedArtworks.length;
    const totalPages = limit ? Math.ceil(artworks.length / limit) : 1;
    const nextPage = page && limit && page < totalPages ? page + 1 : undefined;

    return {
      page,
      pageSize,
      nextPage,
      previousPage,
      totalPages,
      artworks: paginatedArtworks,
      popularityScores: popularityScores,
    };
  }
}

export default ProductDemandService;

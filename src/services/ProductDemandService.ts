import SessionService from './SessionService';
import { Artwork, Event, WishlistItem, CartItem, RentalOrder, RentalOrderItem } from '@/models/sequelize';
import { EVENT_CATEGORY, EVENT_NAME, ORDER_STATUS } from '@/lib/constants';
import { Op } from 'sequelize';
import { PopularityScore } from '@/types/analytics';
import { opTimeframe } from '@/lib/orm';
import { calculatePopularityScore } from '@/lib/analytics';
import { ArtworkWithScore } from '@/models/Artwork';
import ArtworkRepository from '@/repositories/ArtworkRepository';

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

  async getArtworksViewCounts(options: any = {}): Promise<{ [artworkId: number]: number }> {
    const { where = {} } = options;
    const events = await Event.findAll({
      where: {
        name: EVENT_NAME.VIEW_ARTWORK,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
        ...where,
      },
      attributes: ['entityId', 'sessionId'],
    });
    const viewCounts: { [artworkId: number]: number } = {};
    events.forEach((event) => {
      const artworkId = event.entityId;
      viewCounts[artworkId] = (viewCounts[artworkId] || 0) + 1;
    });
    return viewCounts;
  }
  async getArtworksCartCounts(options: any = {}): Promise<{ [artworkId: number]: number }> {
    const { where = {} } = options;
    const cartItems = await Event.findAll({
      where: {
        name: EVENT_NAME.ADD_TO_CART,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
        ...where,
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
  async getArtworksWishlistCounts(options: any = {}): Promise<{ [artworkId: number]: number }> {
    const { where = {} } = options;
    const wishlistItems = await Event.findAll({
      where: {
        name: EVENT_NAME.ADD_TO_WISHLIST,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
        ...where,
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
  async getArtworksOrderCounts(options: any = {}): Promise<{ [artworkId: number]: number }> {
    const { where = {} } = options;
    const orderItems = await RentalOrderItem.findAll({
      include: [
        {
          model: RentalOrder,
          as: 'rentalOrder',
          where: {
            ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
            ...where,
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
  async getArtworksRentedCounts(options: any = {}): Promise<{ [artworkId: number]: number }> {
    const { where = {} } = options;
    const rentedItems = await RentalOrderItem.findAll({
      include: [
        {
          model: RentalOrder,
          as: 'rentalOrder',
          where: {
            status: ORDER_STATUS.COMPLETED,
            ...(this.timeframe && { updatedAt: opTimeframe(this.timeframe) }),
            ...where,
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

  async getArtworksPopularityScores({
    page,
    limit,
    sort = 'popular',
  }: {
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    const [viewCounts, cartCounts, wishlistCounts, orderCounts, rentedCounts] = await Promise.all([
      this.getArtworksViewCounts(),
      this.getArtworksCartCounts(),
      this.getArtworksWishlistCounts(),
      this.getArtworksOrderCounts(),
      this.getArtworksRentedCounts(),
    ]);

    const { count, artworksWithScores, popularityScores } = await this.getPopularityScores(
      viewCounts,
      cartCounts,
      wishlistCounts,
      orderCounts,
      rentedCounts
    );

    const sortedArtworks =
      sort && sort === 'popular' ? artworksWithScores.sort((a, b) => b.score - a.score) : artworksWithScores;

    const previousPage = page && limit && page > 1 ? page - 1 : undefined;
    const paginatedArtworks = page && limit ? sortedArtworks.slice((page - 1) * limit, page * limit) : sortedArtworks;
    const pageSize = paginatedArtworks.length;
    const totalPages = limit ? Math.ceil(count.totalArtworks / limit) : 1;
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

  async getUserDemandArtworks(userId: number, options?: { limit: number }) {
    const sessionService = new SessionService();
    const sessionIds = await sessionService.getUserSessionIds(userId);

    const [viewCounts, cartCounts, wishlistCounts, orderCounts, rentedCounts] = await Promise.all([
      this.getArtworksViewCounts({
        where: {
          sessionId: { [Op.in]: sessionIds },
        },
      }),
      this.getArtworksCartCounts({
        where: {
          sessionId: { [Op.in]: sessionIds },
        },
      }),
      this.getArtworksWishlistCounts({
        where: {
          sessionId: { [Op.in]: sessionIds },
        },
      }),
      this.getArtworksOrderCounts({
        where: {
          userId: userId,
        },
      }),
      this.getArtworksRentedCounts({
        where: {
          userId: userId,
        },
      }),
    ]);

    const { count, artworksWithScores, popularityScores } = await this.getPopularityScores(
      viewCounts,
      cartCounts,
      wishlistCounts,
      orderCounts,
      rentedCounts
    );

    const limit = options?.limit || count.scoredArtworks;
    const artworks = artworksWithScores.sort((a, b) => b.score - a.score).slice(0, limit);
    console.log('User Demand Artworks:', artworks, popularityScores);
    return { artworks, popularityScores };
  }

  private async getPopularityScores(
    viewCounts: { [artworkId: number]: number },
    cartCounts: { [artworkId: number]: number },
    wishlistCounts: { [artworkId: number]: number },
    orderCounts: { [artworkId: number]: number },
    rentedCounts: { [artworkId: number]: number }
  ): Promise<{
    count: { totalArtworks: number; scoredArtworks: number };
    artworksWithScores: ArtworkWithScore[];
    popularityScores: { [artworkId: number]: PopularityScore };
  }> {
    const artworks = await ArtworkRepository.findAll();

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
        ...artwork,
        score,
      };
    });
    return {
      artworksWithScores,
      popularityScores,
      count: {
        totalArtworks: artworks.length,
        scoredArtworks: artworksWithScores.length,
      },
    };
  }
}

export default ProductDemandService;

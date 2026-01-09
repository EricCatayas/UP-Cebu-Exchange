import { Artwork, Event, WishlistItem, CartItem, RentalOrder, RentalOrderItem } from '@/models/sequelize';
import { EVENT_CATEGORY, EVENT_NAME, ORDER_STATUS } from '@/lib/constants';
import { Op } from 'sequelize';

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
  async getArtworkRentedCount(artworkId: number): Promise<number> {
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
      },
      attributes: ['entity_id'],
    });
    const viewCounts: { [artworkId: number]: number } = {};
    events.forEach((event) => {
      const artworkId = event.entity_id;
      viewCounts[artworkId] = (viewCounts[artworkId] || 0) + 1;
    });
    return viewCounts;
  }
  async getArtworksCartCounts(): Promise<{ [artworkId: number]: number }> {
    const cartItems = await CartItem.findAll({
      attributes: ['artworkId'],
    });
    const cartCounts: { [artworkId: number]: number } = {};
    cartItems.forEach((item) => {
      const artworkId = item.artworkId;
      cartCounts[artworkId] = (cartCounts[artworkId] || 0) + 1;
    });
    return cartCounts;
  }
  async getArtworksWishlistCounts(): Promise<{ [artworkId: number]: number }> {
    const wishlistItems = await WishlistItem.findAll({
      attributes: ['artworkId'],
    });
    const wishlistCounts: { [artworkId: number]: number } = {};
    wishlistItems.forEach((item) => {
      const artworkId = item.artworkId;
      wishlistCounts[artworkId] = (wishlistCounts[artworkId] || 0) + 1;
    });
    return wishlistCounts;
  }
  async getArtworksOrderCounts(): Promise<{ [artworkId: number]: number }> {
    const orderItems = await RentalOrderItem.findAll({
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

  async getArtworksPopularityScores() {
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

    // Sort by popularity score in descending order
    const sorted = artworksWithScores.sort((a, b) => b.popularityScore - a.popularityScore);
    // Return limited results if specified
    return {
      artworks: sorted,
      popularityScores: popularityScores,
    };
  }
}

export default ProductDemandService;

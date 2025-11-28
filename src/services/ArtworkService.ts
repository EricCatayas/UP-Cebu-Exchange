import { Op } from 'sequelize';
import ArtworkRepository from '@/repositories/ArtworkRepository';
import WishlistService from './WishlistService';
import { Cart, CartItem, Wishlist, WishlistItem } from '@/models/sequelize';
import { ArtworkDTO, PaginatedArtworks } from '@/models/Artwork';
import { ARTWORK_STATUS, PAGE_SIZE } from '@/lib/constants';

interface QueryParams {
  search?: string;
  sort?: 'popular' | 'latest';
  styles?: number[];
  mediums?: string[];
  page?: number;
  limit: number;
}

class ArtworkService {
  userId?: number;

  constructor(userId?: number) {
    this.userId = userId;
  }

  async getArtworksForCustomer({
    search,
    sort,
    styles,
    mediums,
    page = 1,
    limit = PAGE_SIZE,
  }: QueryParams): Promise<PaginatedArtworks> {
    // Build filtering options based on params
    let options = {};
    const offset = (page - 1) * limit;
    const where: any = {
      status: [ARTWORK_STATUS.AVAILABLE, ARTWORK_STATUS.RENTED],
    };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        // { '$artist.name$': { [Op.like]: `%${search}%` } }, // Todo: Unknown column 'artist.name' in 'where clause'
      ];
    }
    if (styles && styles.length > 0) {
      where.styleId = { [Op.in]: styles };
    }
    if (mediums && mediums.length > 0) {
      where.medium = { [Op.in]: mediums };
    }

    // TODO: Sorting
    if (sort) {
      // if(sort === 'popular'){
      //    order = [['popularityScore', 'DESC']]
      // }
      if (sort === 'latest') {
        options = { ...options, order: [['createdAt', 'DESC']] };
      }
    }

    options = { where, page, limit, offset };

    console.log('ArtworkService - Query Options:', options);

    const result = await ArtworkRepository.findPaginated({
      ...options,
    });

    const artworks = result.items;
    const cartArtworkIds = await this.getUserCartArtworkIds();
    const wishlistArtworkIds = await this.getUserWishlistArtworkIds();

    return {
      page,
      pageSize: result.pageSize,
      nextPage: result.nextPage,
      previousPage: result.previousPage,
      totalPages: result.totalPages,
      items: artworks.map((artwork) => {
        const artworkDTO: ArtworkDTO = {
          ...artwork,
          isInCart: cartArtworkIds.includes(artwork.id),
          isInWishlist: wishlistArtworkIds.includes(artwork.id),
        };
        return artworkDTO;
      }),
    };
  }

  async getAvailableArtworks(): Promise<ArtworkDTO[]> {
    const availableArtworks = await ArtworkRepository.findAll({
      where: {
        status: ARTWORK_STATUS.AVAILABLE,
      },
      include: ['artist', 'tags', 'style', 'rentalPlans', 'images'],
    });

    return availableArtworks;
  }

  async getAllArtworks(): Promise<ArtworkDTO[]> {
    const allArtworks = await ArtworkRepository.findAll();

    return allArtworks;
  }

  async getArtworkById(id: number): Promise<ArtworkDTO | null> {
    const artwork = await ArtworkRepository.findById(id);

    if (!artwork) {
      return null;
    }

    const cartArtworkIds = await this.getUserCartArtworkIds();
    const wishlistArtworkIds = await this.getUserWishlistArtworkIds();

    return artwork
      ? ({
          ...artwork,
          isInCart: cartArtworkIds.includes(artwork.id),
          isInWishlist: wishlistArtworkIds.includes(artwork.id),
        } as ArtworkDTO)
      : null;
  }

  async getArtworksFromArtist(artistId: number) {
    return await ArtworkRepository.findAll({ where: { artistId } });
  }

  async getUserWishlistArtworks(): Promise<ArtworkDTO[]> {
    if (!this.userId) {
      return [];
    }

    const wishlistItems = await WishlistService.getWishlistItems(this.userId);

    const cartArtworkIds = await this.getUserCartArtworkIds();

    return wishlistItems.map((item) => {
      const artwork = {
        ...item.artwork,
        isInCart: cartArtworkIds.includes(item.artwork.id),
        isInWishlist: true,
      } as ArtworkDTO;

      return artwork;
    });
  }

  // TODO:
  async getSimilarArtworks(artworkId: number) {
    const artworks = await ArtworkRepository.findAll({ limit: 20 });
    const shuffled = artworks.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }

  async getFavoriteArtworks() {
    const artworks = await ArtworkRepository.findAll({ limit: 20 });
    const shuffled = artworks.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  async getRecommendedArtworks() {
    const artworks = await ArtworkRepository.findAll({ limit: 20 });
    const shuffled = artworks.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  private async getUserCartArtworkIds() {
    if (!this.userId) return [];
    const cart = await Cart.findOne({
      where: { userId: this.userId },
      include: [{ model: CartItem, as: 'cartItems' }],
    });
    return cart ? cart.cartItems.map((item) => item.artworkId) : [];
  }

  private async getUserWishlistArtworkIds() {
    if (!this.userId) return [];
    const wishlist = await Wishlist.findOne({
      where: { userId: this.userId },
      include: [{ model: WishlistItem, as: 'wishlistItems' }],
    });
    return wishlist ? wishlist.wishlistItems.map((item) => item.artworkId) : [];
  }
}

export default ArtworkService;

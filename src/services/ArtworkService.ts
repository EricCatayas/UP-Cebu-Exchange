import ArtworkRepository from '@/repositories/ArtworkRepository';
import ArtistService from './ArtistService';
import TagsService from '@/services/TagsService';
import StylesService from '@/services/StylesService';
import WishlistService from '@/services/WishlistService';
import { Op } from 'sequelize';
import {
  Artwork,
  ArtworkImage,
  Artist,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  Tag,
  Style,
  RentalPlan,
  ArtworkTag,
} from '@/models/sequelize';
import { ArtworkDTO, PaginatedArtworks } from '@/models/Artwork';
import { similarityScore } from '@/lib/recommendations';
import { ARTWORK_STATUS, PAGE_SIZE, SIMILAR_ARTWORK_SCORE_THRESHOLD } from '@/lib/constants';

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
    let order: any = [];

    if (search) {
      const [artistMatches, tagMatches, styleMatches] = await Promise.all([
        ArtistService.getAllArtists({
          where: { name: { [Op.like]: `%${search}%` } },
        }),
        TagsService.getAllTags({
          where: { name: { [Op.like]: `%${search}%` } },
        }),
        StylesService.getAllStyles({
          where: { name: { [Op.like]: `%${search}%` } },
        }),
      ]);
      const artistIds = artistMatches.map((artist) => artist.id);
      const styleIds = styleMatches.map((style) => style.id);
      const tagIds = tagMatches.map((tag) => tag.id);

      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        ...(artistIds.length > 0 ? [{ artistId: { [Op.in]: artistIds } }] : []),
        ...(styleIds.length > 0 ? [{ styleId: { [Op.in]: styleIds } }] : []),
        ...(tagIds.length > 0
          ? [
              {
                id: {
                  [Op.in]: ArtworkTag.findAll({
                    attributes: ['artworkId'],
                    where: { tagId: { [Op.in]: tagIds } },
                  }).then((artworkTags) => artworkTags.map((at) => at.artworkId)),
                },
              },
            ]
          : []),
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
        order = [['createdAt', 'DESC']];
      }
    }

    options = { where, order, page, limit, offset };

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

  async getArtworksFromArtist(artistId?: number) {
    if (!artistId) {
      return [];
    }
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
    const artwork = await ArtworkRepository.findById(artworkId);
    if (!artwork) return [];

    let otherSimilarArtworks: ArtworkDTO[] = [];
    let otherArtworksWithSimilarTags: ArtworkDTO[] = [];

    const getOtherSimilarArtworksByFeatures = async () => {
      const where: any = {
        id: { [Op.ne]: artworkId },
        status: [ARTWORK_STATUS.AVAILABLE, ARTWORK_STATUS.RENTED],
      };

      where[Op.or] = [
        // { artistId: artwork.artistId },
        { styleId: artwork.styleId },
        { medium: artwork.medium },
      ];

      let options = {
        where,
      };

      const artworks = await ArtworkRepository.findAll(options);
      otherSimilarArtworks = artworks;
    };

    const getOtherArtworksByTags = async () => {
      const options = {
        include: [{ model: Artwork, as: 'artwork', include: ['artist', 'rentalPlans', 'tags', 'images'] }],
      };

      for (let i = 0; i < artwork.tags.length; i++) {
        const tagId = artwork.tags[i].id;
        const artworksWithTag = await TagsService.getArtworksByTag(tagId, options);
        const filteredArtworks = artworksWithTag.filter((a) => a.id !== artworkId);
        otherArtworksWithSimilarTags = otherArtworksWithSimilarTags.concat(filteredArtworks);
      }
    };

    await Promise.all([getOtherSimilarArtworksByFeatures(), getOtherArtworksByTags()]);

    // Combine and rank by similarity score
    const allSimilarArtworks = [...otherSimilarArtworks, ...otherArtworksWithSimilarTags];
    const uniqueArtworksMap: { [key: number]: { score: number; artwork: ArtworkDTO } } = {};
    allSimilarArtworks.forEach((similarArtwork) => {
      if (!uniqueArtworksMap[similarArtwork.id]) {
        uniqueArtworksMap[similarArtwork.id] = {
          score: similarityScore(artwork, similarArtwork),
          artwork: similarArtwork,
        };
      }
    });

    const uniqueArtworks = Object.values(uniqueArtworksMap);

    const sortedArtworks = uniqueArtworks
      .filter((entry) => entry.score > SIMILAR_ARTWORK_SCORE_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9);

    return sortedArtworks.map((entry) => entry.artwork);
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

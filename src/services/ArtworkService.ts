import ArtworkRepository from '@/repositories/ArtworkRepository';
import WishlistService from './WishlistService';
import { Cart, CartItem, Wishlist, WishlistItem } from '@/models/sequelize';
import { ArtworkDTO } from '@/models/Artwork';
import { ARTWORK_STATUS } from '@/lib/constants';

class ArtworkService {
  userId?: number;

  constructor(userId?: number) {
    this.userId = userId;
  }

  async getArtworksForCustomer(): Promise<ArtworkDTO[]> {
    const artworks = await ArtworkRepository.findAll({
      where: {
        status: [ARTWORK_STATUS.AVAILABLE, ARTWORK_STATUS.RENTED],
      },
    });

    const cartArtworkIds = await this.getUserCartArtworkIds();
    const wishlistArtworkIds = await this.getUserWishlistArtworkIds();

    return artworks.map((artwork) => {
      const artworkDTO: ArtworkDTO = {
        ...artwork,
        isInCart: cartArtworkIds.includes(artwork.id),
        isInWishlist: wishlistArtworkIds.includes(artwork.id),
      };
      return artworkDTO;
    });
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

  async getPaginatedArtworks(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return await ArtworkRepository.findAll({ offset, limit });
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

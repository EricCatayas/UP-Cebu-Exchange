import ArtworkRepository from '@/repositories/ArtworkRepository';
import { Cart, CartItem, Wishlist, WishlistItem } from '@/models/sequelize';
import { ArtworkDTO } from '@/models/Artwork';

class ArtworkService {
  userId?: number;

  constructor(userId?: number) {
    this.userId = userId;
  }

  async getAllArtworks(): Promise<ArtworkDTO[]> {
    const allArtworks = await ArtworkRepository.findAll();

    let cartArtworkIds: number[] = [];
    let wishlistArtworkIds: number[] = [];

    if (this.userId) {
      // Map to include isInCart and isInWishlist
      const cart = await Cart.findOne({
        where: { userId: this.userId },
        include: [{ model: CartItem, as: 'cartItems' }],
      });
      const wishlist = await Wishlist.findOne({
        where: { userId: this.userId },
        include: [{ model: WishlistItem, as: 'wishlistItems' }],
      });

      cartArtworkIds = cart ? cart.cartItems.map((item) => item.artworkId) : [];
      wishlistArtworkIds = wishlist ? wishlist.wishlistItems.map((item) => item.artworkId) : [];
    }

    return allArtworks.map((artwork) => {
      const artworkDTO: ArtworkDTO = {
        ...artwork,
        isInCart: cartArtworkIds.includes(artwork.id),
        isInWishlist: wishlistArtworkIds.includes(artwork.id),
      };
      return artworkDTO;
    });
  }

  async getArtworkById(id: number): Promise<ArtworkDTO | null> {
    const artwork = await ArtworkRepository.findById(id);
    let cartArtworkIds: number[] = [];
    let wishlistArtworkIds: number[] = [];

    if (this.userId && artwork) {
      const cart = await Cart.findOne({
        where: { userId: this.userId },
        include: [{ model: CartItem, as: 'cartItems' }],
      });
      const wishlist = await Wishlist.findOne({
        where: { userId: this.userId },
        include: [{ model: WishlistItem, as: 'wishlistItems' }],
      });
      cartArtworkIds = cart ? cart.cartItems.map((item) => item.artworkId) : [];
      wishlistArtworkIds = wishlist ? wishlist.wishlistItems.map((item) => item.artworkId) : [];
    }

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

  async getPaginatedArtworks(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return await ArtworkRepository.findAll({ offset, limit });
  }

  // TODO:
  async getSimilarArtworks(artworkId: number) {
    return await ArtworkRepository.findAll({ limit: 6 });
  }
}

export default ArtworkService;

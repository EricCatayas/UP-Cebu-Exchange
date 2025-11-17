import { Artwork, Wishlist, WishlistItem, RentalPlan, ArtworkImage } from '@/models/sequelize';

class WishlistService {
  async addItem(userId: number, artworkId: number) {
    let wishlist = await Wishlist.findOne({ where: { userId } });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId });
    }
    let wishlistItem = await WishlistItem.findOne({
      where: { wishlistId: wishlist.id, artworkId },
    });
    if (!wishlistItem) {
      await WishlistItem.create({ wishlistId: wishlist.id, artworkId });
    }
  }

  async removeItem(userId: number, artworkId: number) {
    const wishlist = await Wishlist.findOne({ where: { userId } });
    if (!wishlist) {
      throw new Error('Wishlist not found for user');
    }
    const wishlistItem = await WishlistItem.findOne({
      where: { wishlistId: wishlist.id, artworkId },
    });
    if (!wishlistItem) {
      throw new Error('Item not found in wishlist');
    }
    await wishlistItem.destroy();
  }

  async isItemInWishlist(userId: number, artworkId: number) {
    const wishlist = await Wishlist.findOne({ where: { userId } });
    if (!wishlist) {
      return false;
    }
    const wishlistItem = await WishlistItem.findOne({
      where: { wishlistId: wishlist.id, artworkId },
    });
    return !!wishlistItem;
  }

  async getWishlistItems(userId: number) {
    const wishlist = await Wishlist.findOne({
      where: { userId },
      include: [
        {
          model: WishlistItem,
          as: 'wishlistItems',
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

    if (!wishlist) {
      return [];
    }
    return wishlist.wishlistItems.map((item) => item.toJSON());
  }
}

export default new WishlistService();

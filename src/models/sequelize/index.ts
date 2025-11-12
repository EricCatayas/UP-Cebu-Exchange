import sequelize from '@/config/database';
import User from './User';
import Role from './Role';
import Artist from './Artist';
import Artwork from './Artwork';
import Address from './Address';
import ArtworkImage from './ArtworkImage';
import ArtworkTag from './ArtworkTag';
import Style from './Style';
import Tag from './Tag';
import Cart from './Cart';
import CartItem from './CartItem';
import Wishlist from './Wishlist';
import WishlistItem from './WishlistItem';
import RentalPlan from './RentalPlan';
import RentalPlanSnapshot from './RentalPlanSnapshot';
import RentalOrder from './RentalOrder';
import RentalOrderItem from './RentalOrderItem';
import Payment from './Payment';

// Define associations
const initializeAssociations = () => {
  // User belongs to Role
  User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role',
  });

  // Role has many Users
  Role.hasMany(User, {
    foreignKey: 'roleId',
    as: 'users',
  });

  // User has one Address (optional)
  User.hasOne(Address, {
    foreignKey: 'userId',
    as: 'address',
  });

  // Address belongs to User
  Address.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // Artist has many Artworks
  Artist.hasMany(Artwork, {
    foreignKey: 'artistId',
    as: 'artworks',
  });

  // Artwork belongs to Artist
  Artwork.belongsTo(Artist, {
    foreignKey: 'artistId',
    as: 'artist',
  });

  // Artwork has many ArtworkImages
  Artwork.hasMany(ArtworkImage, {
    foreignKey: 'artworkId',
    as: 'images',
  });

  // ArtworkImage belongs to Artwork
  ArtworkImage.belongsTo(Artwork, {
    foreignKey: 'artworkId',
    as: 'artwork',
  });

  // Artwork belongs to Style
  Artwork.belongsTo(Style, {
    foreignKey: 'styleId',
    as: 'style',
  });

  // Style has many Artworks
  Style.hasMany(Artwork, {
    foreignKey: 'styleId',
    as: 'artworks',
  });

  // Many-to-Many: Artwork belongsToMany Tag through ArtworkTag
  Artwork.belongsToMany(Tag, {
    through: ArtworkTag,
    foreignKey: 'artworkId',
    otherKey: 'tagId',
    as: 'tags',
  });

  // Many-to-Many: Tag belongsToMany Artwork through ArtworkTag
  Tag.belongsToMany(Artwork, {
    through: ArtworkTag,
    foreignKey: 'tagId',
    otherKey: 'artworkId',
    as: 'artworks',
  });

  // Artwork has many RentalPlans
  Artwork.hasMany(RentalPlan, {
    foreignKey: 'artworkId',
    as: 'rentalPlans',
  });

  // RentalPlan belongs to Artwork
  RentalPlan.belongsTo(Artwork, {
    foreignKey: 'artworkId',
    as: 'artwork',
  });

  // User has one Cart
  User.hasOne(Cart, {
    foreignKey: 'userId',
    as: 'cart',
  });

  // Cart belongs to User
  Cart.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // Cart has many CartItems
  Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
    as: 'cartItems',
  });

  // CartItem belongs to Cart
  CartItem.belongsTo(Cart, {
    foreignKey: 'cartId',
    as: 'cart',
  });

  // CartItem belongs to Artwork
  CartItem.belongsTo(Artwork, {
    foreignKey: 'artworkId',
    as: 'artwork',
  });

  // User has one Wishlist
  User.hasOne(Wishlist, {
    foreignKey: 'userId',
    as: 'wishlist',
  });

  // Wishlist belongs to User
  Wishlist.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // Wishlist has many WishlistItems
  Wishlist.hasMany(WishlistItem, {
    foreignKey: 'wishlistId',
    as: 'wishlistItems',
  });

  // WishlistItem belongs to Wishlist
  WishlistItem.belongsTo(Wishlist, {
    foreignKey: 'wishlistId',
    as: 'wishlist',
  });

  // WishlistItem belongs to Artwork
  WishlistItem.belongsTo(Artwork, {
    foreignKey: 'artworkId',
    as: 'artwork',
  });

  // User has many RentalOrders
  User.hasMany(RentalOrder, {
    foreignKey: 'userId',
    as: 'rentalOrders',
  });

  // RentalOrder belongs to User
  RentalOrder.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // RentalOrder has many RentalOrderItems
  RentalOrder.hasMany(RentalOrderItem, {
    foreignKey: 'rentalOrderId',
    as: 'rentalOrderItems',
  });

  // RentalOrderItem belongs to RentalOrder
  RentalOrderItem.belongsTo(RentalOrder, {
    foreignKey: 'rentalOrderId',
    as: 'rentalOrder',
  });

  // RentalOrderItem belongs to Artwork
  RentalOrderItem.belongsTo(Artwork, {
    foreignKey: 'artworkId',
    as: 'artwork',
  });

  RentalOrderItem.hasOne(RentalPlanSnapshot, {
    foreignKey: 'rentalOrderItemId',
    as: 'rentalPlanSnapshot',
  });

  RentalPlanSnapshot.belongsTo(RentalOrderItem, {
    foreignKey: 'rentalOrderItemId',
    as: 'rentalOrderItem',
  });

  // RentalOrder has one Payment
  RentalOrder.hasOne(Payment, {
    foreignKey: 'rentalOrderId',
    as: 'payment',
  });

  // Payment belongs to RentalOrder
  Payment.belongsTo(RentalOrder, {
    foreignKey: 'rentalOrderId',
    as: 'rentalOrder',
  });

  // User has many Payments
  User.hasMany(Payment, {
    foreignKey: 'userId',
    as: 'payments',
  });

  // Payment belongs to User
  Payment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

// Initialize associations
initializeAssociations();

// Export models and sequelize instance
export {
  sequelize,
  User,
  Role,
  Artist,
  Artwork,
  Address,
  Style,
  Tag,
  ArtworkTag,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  ArtworkImage,
  RentalOrder,
  RentalOrderItem,
  RentalPlan,
  RentalPlanSnapshot,
  Payment,
};

export default {
  sequelize,
  User,
  Role,
  Artist,
  Artwork,
  Address,
  Style,
  Tag,
  ArtworkTag,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  ArtworkImage,
  RentalOrder,
  RentalOrderItem,
  RentalPlan,
  RentalPlanSnapshot,
  Payment,
};

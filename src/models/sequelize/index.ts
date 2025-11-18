import sequelize from '@/config/database';

// Import all models (this triggers their Model.init() calls)
import Address from './Address';
import Artist from './Artist';
import Artwork from './Artwork';
import ArtworkImage from './ArtworkImage';
import ArtworkTag from './ArtworkTag';
import Cart from './Cart';
import CartItem from './CartItem';
import Payment from './Payment';
import RentalOrder from './RentalOrder';
import RentalOrderItem from './RentalOrderItem';
import RentalPlan from './RentalPlan';
import Role from './Role';
import Style from './Style';
import Tag from './Tag';
import User from './User';
import UserAddress from './UserAddress';
import Wishlist from './Wishlist';
import WishlistItem from './WishlistItem';

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

  // User has many Address (optional)
  User.belongsToMany(Address, {
    through: UserAddress,
    foreignKey: 'userId',
    otherKey: 'addressId',
    as: 'addresses',
  });

  // UserAddress belongs to Address
  UserAddress.belongsTo(Address, {
    foreignKey: 'addressId',
    as: 'address',
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
    constraints: false,
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
    constraints: false,
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
    constraints: false,
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

  // RentalOrder has one Payment
  RentalOrder.belongsTo(Payment, {
    foreignKey: 'paymentId',
    as: 'payment',
  });

  // RentalOrder belongs to Address
  RentalOrder.belongsTo(Address, {
    foreignKey: 'addressId',
    as: 'address',
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
  Address,
  Artist,
  Artwork,
  ArtworkImage,
  ArtworkTag,
  Cart,
  CartItem,
  Payment,
  RentalOrder,
  RentalOrderItem,
  RentalPlan,
  Role,
  Style,
  Tag,
  User,
  UserAddress,
  Wishlist,
  WishlistItem,
};

export default {
  sequelize,
  Address,
  Artist,
  Artwork,
  ArtworkImage,
  ArtworkTag,
  Cart,
  CartItem,
  Payment,
  RentalOrder,
  RentalOrderItem,
  RentalPlan,
  Role,
  Style,
  Tag,
  User,
  UserAddress,
  Wishlist,
  WishlistItem,
};

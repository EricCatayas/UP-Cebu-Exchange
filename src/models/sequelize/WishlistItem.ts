import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface WishlistItemAttributes {
  id: number;
  wishlistId: number;
  artworkId: number;
}

interface WishlistItemCreationAttributes extends Optional<WishlistItemAttributes, 'id'> {}

class WishlistItem extends Model<WishlistItemAttributes, WishlistItemCreationAttributes> implements WishlistItemAttributes {
  public id!: number;
  public wishlistId!: number;
  public artworkId!: number;
}

WishlistItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    wishlistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'wishlists',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    artworkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'artworks',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'WishlistItem',
    tableName: 'wishlist_items',
    timestamps: false,
    indexes: [
      {
        fields: ['wishlistId'],
      },
      {
        fields: ['artworkId'],
      },
      {
        unique: true,
        fields: ['wishlistId', 'artworkId'],
      },
    ],
  }
);

export default WishlistItem;
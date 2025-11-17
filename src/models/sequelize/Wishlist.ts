import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';
import { WishlistAttributes } from '@/models/Wishlist';

interface WishlistCreationAttributes extends Optional<WishlistAttributes, 'id'> {}

class Wishlist extends Model<WishlistAttributes, WishlistCreationAttributes> implements WishlistAttributes {
  declare id: number;
  declare userId: number;
}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'wishlists',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['userId'],
      },
    ],
  }
);

export default Wishlist;

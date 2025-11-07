import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface WishlistAttributes {
  id: number;
  userId: number;
}

interface WishlistCreationAttributes extends Optional<WishlistAttributes, 'id'> {}

class Wishlist extends Model<WishlistAttributes, WishlistCreationAttributes> implements WishlistAttributes {
  public id!: number;
  public userId!: number;
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
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';
import { CartItemAttributes } from '@/models/CartItem';

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id' | 'createdAt'> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
  declare id: number;
  declare cartId: number;
  declare artworkId: number;
  declare createdAt: Date;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'carts',
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
    timestamps: false,
    indexes: [
      {
        fields: ['cartId'],
      },
      {
        fields: ['artworkId'],
      },
      {
        unique: true,
        fields: ['cartId', 'artworkId'],
      },
    ],
  }
);

export default CartItem;

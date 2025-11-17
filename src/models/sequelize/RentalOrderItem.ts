import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';
import { RentalOrderItemAttributes } from '@/models/RentalOrderItem';

interface RentalOrderItemCreationAttributes extends Optional<RentalOrderItemAttributes, 'id'> {}

class RentalOrderItem
  extends Model<RentalOrderItemAttributes, RentalOrderItemCreationAttributes>
  implements RentalOrderItemAttributes
{
  declare id: number;
  declare rentalOrderId: number;
  declare artworkId: number;
}

RentalOrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rentalOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rental_orders',
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
    modelName: 'RentalOrderItem',
    tableName: 'rental_order_items',
    timestamps: false,
    indexes: [
      {
        fields: ['rentalOrderId'],
      },
      {
        fields: ['artworkId'],
      },
      {
        unique: true,
        fields: ['rentalOrderId', 'artworkId'],
      },
    ],
  }
);

export default RentalOrderItem;

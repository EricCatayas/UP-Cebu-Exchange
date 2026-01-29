import sequelize from '@/config/database';
import { DataTypes, Model, Optional, Op } from 'sequelize';
import { RentalOrderExtensionAttributes } from '@/models/RentalOrderExtension';

interface RentalOrderExtensionCreationAttributes extends Optional<
  RentalOrderExtensionAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {}

class RentalOrderExtension
  extends Model<RentalOrderExtensionAttributes, RentalOrderExtensionCreationAttributes>
  implements RentalOrderExtensionAttributes
{
  declare id: number;
  declare originalOrderId: number;
  declare extensionOrderId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}
RentalOrderExtension.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    originalOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rental_orders',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    extensionOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rental_orders',
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
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'rental_order_extensions',
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
  }
);

export default RentalOrderExtension;

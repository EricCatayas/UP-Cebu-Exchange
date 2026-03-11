import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';
import { BillingFeeAttributes } from '@/models/BillingFee';

interface BillingFeeCreationAttributes extends Optional<BillingFeeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class BillingFee extends Model<BillingFeeAttributes, BillingFeeCreationAttributes> implements BillingFeeAttributes {
  declare id: number;
  declare rentalOrderId?: number | null;
  declare paymentId?: number | null;
  declare type: string;
  declare label: string;
  declare amount: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

BillingFee.init(
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
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
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
    modelName: 'BillingFee',
    tableName: 'billing_fees',
    timestamps: true,
    indexes: [
      {
        fields: ['rentalOrderId'],
      },
      {
        fields: ['type'],
      },
    ],
  }
);

export default BillingFee;

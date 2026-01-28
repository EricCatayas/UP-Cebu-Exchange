import { DataTypes, Model, Optional, Op } from 'sequelize';
import sequelize from '@/config/database';
import { RentalOrderAttributes } from '@/models/RentalOrder';
import { ORDER_STATUS } from '@/lib/constants';

interface RentalOrderCreationAttributes extends Optional<
  RentalOrderAttributes,
  'id' | 'status' | 'createdAt' | 'updatedAt'
> {}

class RentalOrder extends Model<RentalOrderAttributes, RentalOrderCreationAttributes> implements RentalOrderAttributes {
  declare id: number;
  declare userId: number;
  declare addressId: number;
  declare paymentId: number;
  declare startDate: Date;
  declare endDate: Date;
  declare deliveryMethod?: string;
  declare durationMonths: number;
  declare status: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Instance methods
  public getDaysRemaining(): number {
    if (this.status !== 'Confirmed') return 0;
    const today = new Date();
    const timeDiff = this.endDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  }
}

RentalOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'payments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deliveryMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    durationMonths: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 120,
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ORDER_STATUS.PENDING,
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
    modelName: 'RentalOrder',
    tableName: 'rental_orders',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['paymentId'],
        unique: true,
      },
    ],
  }
);

export default RentalOrder;

import sequelize from '@/config/database';
import RentalOrderExtension from './RentalOrderExtension';
import { DataTypes, Model, Optional, Op } from 'sequelize';
import { RentalOrderAttributes } from '@/models/RentalOrder';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';
import { getReturnDueDate, isOrderDueReceive, isOrderOverdue, isOrderExtended } from '@/lib/order';
import Address from './Address';
import User from './User';
import Payment from './Payment';

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
  declare address: Address;
  declare payment: Payment;
  declare user: User;
  declare extension?: RentalOrderExtension;

  // Instance methods

  public getStatus(): string {
    // const today = new Date();
    // const startDate = new Date(this.startDate);
    // const endDate = new Date(this.endDate);

    if ([ORDER_STATUS.CANCELLED].includes(this.status as ORDER_STATUS)) {
      return this.status;
    }

    if (isOrderExtended(this)) {
      return ORDER_STATUS.EXTENDED;
    }

    if (isOrderDueReceive(this)) {
      return ORDER_STATUS.TORECEIVE;
    }

    if (isOrderOverdue(this)) {
      return ORDER_STATUS.TORETURN;
    }

    return this.status;
  }

  public getDueDate(): Date | null {
    const status = this.getStatus();

    if ([ORDER_STATUS.PENDING, ORDER_STATUS.RESERVED, ORDER_STATUS.TORECEIVE].includes(this.status as ORDER_STATUS)) {
      return this.startDate;
    }

    if ([ORDER_STATUS.ONGOING, ORDER_STATUS.TORETURN].includes(this.status as ORDER_STATUS)) {
      return getReturnDueDate(this);
    }
    return null;
  }

  public getDaysRemaining(): number {
    if (this.status !== 'Confirmed') return 0;
    const today = new Date();
    const timeDiff = this.endDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  }

  public hasExtension(): boolean {
    return this.extension !== undefined;
  }

  public static async getOrdersDueStart(daysAhead: number = 0): Promise<RentalOrder[]> {
    const today = new Date();
    // default to tomorrow
    const targetDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    return await RentalOrder.findAll({
      where: {
        startDate: {
          [Op.between]: [today, targetDate],
        },
        status: {
          [Op.in]: [ORDER_STATUS.PENDING, ORDER_STATUS.RESERVED, ORDER_STATUS.TORECEIVE],
        },
      },
      include: ['address', 'user', 'payment', 'items'],
    });
  }

  public static async getOrdersDueReturn(daysAhead: number = 0): Promise<RentalOrder[]> {
    const today = new Date();
    // default to tomorrow
    const targetDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    return await RentalOrder.findAll({
      where: {
        endDate: {
          [Op.between]: [today, targetDate],
        },
        status: {
          [Op.in]: [ORDER_STATUS.ONGOING, ORDER_STATUS.TORETURN],
        },
      },
      include: ['address', 'user', 'payment', 'items'],
    });
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

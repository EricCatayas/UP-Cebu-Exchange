import { DataTypes, Model, Optional, Op } from 'sequelize';
import sequelize from '@/config/database';
import { RentalOrderAttributes } from '@/models/RentalOrder';

interface RentalOrderCreationAttributes
  extends Optional<RentalOrderAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class RentalOrder extends Model<RentalOrderAttributes, RentalOrderCreationAttributes> implements RentalOrderAttributes {
  declare id: number;
  declare userId: number;
  declare paymentId: number;
  declare startDate: Date;
  declare endDate: Date;
  declare deliveryMethod?: string;
  declare durationMonths: number;
  declare status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  declare createdAt: Date;
  declare updatedAt: Date;

  // Instance methods
  public isActive(): boolean {
    return this.status === 'Confirmed' && new Date() <= this.endDate;
  }

  public isOverdue(): boolean {
    return this.status === 'Confirmed' && new Date() > this.endDate;
  }

  public getDaysRemaining(): number {
    if (this.status !== 'Confirmed') return 0;
    const today = new Date();
    const timeDiff = this.endDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  }

  // Static method
  public static async findActiveRentals(): Promise<RentalOrder[]> {
    return this.findAll({
      where: {
        status: 'Confirmed',
        endDate: {
          [Op.gte]: new Date(),
        },
      },
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
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'payments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
      type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending',
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

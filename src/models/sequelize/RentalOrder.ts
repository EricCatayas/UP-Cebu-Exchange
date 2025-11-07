import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface RentalOrderAttributes {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  durationMonths: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

interface RentalOrderCreationAttributes extends Optional<RentalOrderAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class RentalOrder extends Model<RentalOrderAttributes, RentalOrderCreationAttributes> implements RentalOrderAttributes {
  public id!: number;
  public userId!: number;
  public startDate!: Date;
  public endDate!: Date;
  public durationMonths!: number;
  public status!: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  public createdAt!: Date;
  public updatedAt!: Date;
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
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
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
        fields: ['startDate'],
      },
      {
        fields: ['endDate'],
      },
    ],
  }
);

export default RentalOrder;
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface PaymentAttributes {
  id: number;
  userId: number;
  rentalOrderId: number;
  amount: number;
  status: "Pending" | "Completed" | "Failed";
  paymentMethod: string;
  createdAt: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'status' | 'createdAt'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public userId!: number;
  public rentalOrderId!: number;
  public amount!: number;
  public status!: "Pending" | "Completed" | "Failed";
  public paymentMethod!: string;
  public createdAt!: Date;
}

Payment.init(
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
    rentalOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'rental_orders',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: false,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['status'],
      },
      {
        unique: true,
        fields: ['rentalOrderId'],
      },
    ],
  }
);

export default Payment;
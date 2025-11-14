import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface PaymentAttributes {
  id: number;
  userId: number;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  paymentMethod: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  declare id: number;
  declare userId: number;
  declare amount: number;
  declare status: 'Pending' | 'Completed' | 'Failed';
  declare paymentMethod: string;
  declare createdAt: Date;
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
    ],
  }
);

export default Payment;

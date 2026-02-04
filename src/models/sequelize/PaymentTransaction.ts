import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';
import { PaymentTransactionAttributes } from '@/models/PaymentTransaction';

interface PaymentTransactionCreationAttributes extends Optional<
  PaymentTransactionAttributes,
  'id' | 'method' | 'currency' | 'metadata' | 'createdAt' | 'updatedAt'
> {}

class PaymentTransaction
  extends Model<PaymentTransactionAttributes, PaymentTransactionCreationAttributes>
  implements PaymentTransactionAttributes
{
  declare id: number;
  declare paymentId: number;
  declare transactionType: string;
  declare amount: number;
  declare currency: string;
  declare method: string;

  // Manual payment fields
  declare recordedByUserId?: number | null;
  declare imageUrl?: string | null;

  // Common metadata
  declare metadata?: Record<string, any> | null;
  declare transactionDate: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PaymentTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'payments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    transactionType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'PHP',
    },
    method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    // Manual payment fields
    recordedByUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    modelName: 'PaymentTransaction',
    tableName: 'payment_transactions',
    timestamps: true,
    indexes: [
      {
        fields: ['paymentId'],
      },
      {
        fields: ['transactionType'],
      },
      {
        fields: ['method'],
      },
      {
        fields: ['recordedByUserId'],
      },
    ],
  }
);

export default PaymentTransaction;

import sequelize from '@/config/database';
import { DataTypes, Model, Optional } from 'sequelize';
import { NotificationAttributes } from '@/models/Notification';

// Define creation attributes
interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, 'id' | 'metadata' | 'readAt' | 'readBy' | 'createdAt'> {}

// Define the Notification model class
class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  declare id: number;
  declare title: string;
  declare type: string;
  declare message: string;
  declare isRead: boolean;
  declare metadata?: string;
  declare createdAt: Date;
  declare readAt?: Date;
  declare readBy?: number;
}

// Initialize the Notification model
Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    readBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: false,
    updatedAt: false,
    indexes: [
      {
        fields: ['readBy'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['isRead'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['readBy', 'isRead'],
      },
    ],
  }
);

export default Notification;

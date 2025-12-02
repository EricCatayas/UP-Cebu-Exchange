import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface UserPasswordResetAttributes {
  id: number;
  userId: number;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

interface UserPasswordResetCreationAttributes
  extends Optional<UserPasswordResetAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the UserPasswordReset model class
class UserPasswordReset
  extends Model<UserPasswordResetAttributes, UserPasswordResetCreationAttributes>
  implements UserPasswordResetAttributes
{
  declare id: number;
  declare userId: number;
  declare token: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare expiresAt: Date;
}

// Initialize the UserPasswordReset model
UserPasswordReset.init(
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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
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
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_password_resets',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['token'],
      },
    ],
  }
);

export default UserPasswordReset;

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface UserEmailVerificationAttributes {
  id: number;
  userId: number;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

interface UserEmailVerificationCreationAttributes
  extends Optional<UserEmailVerificationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the UserEmailVerification model class
class UserEmailVerification
  extends Model<UserEmailVerificationAttributes, UserEmailVerificationCreationAttributes>
  implements UserEmailVerificationAttributes
{
  declare id: number;
  declare userId: number;
  declare token: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare expiresAt: Date;
}

// Initialize the UserEmailVerification model
UserEmailVerification.init(
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
    tableName: 'user_email_verifications',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
    ],
  }
);

export default UserEmailVerification;

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';
import { UserCookiePreferenceAttributes } from '@/models/UserCookiePreference';

interface UserCookiePreferenceCreationAttributes extends Optional<
  UserCookiePreferenceAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {}

class UserCookiePreference
  extends Model<UserCookiePreferenceAttributes, UserCookiePreferenceCreationAttributes>
  implements UserCookiePreferenceAttributes
{
  declare id: number;
  declare userId: number;
  declare preference: 'accept' | 'reject';
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserCookiePreference.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    preference: {
      type: DataTypes.ENUM('accept', 'reject'),
      allowNull: false,
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
    modelName: 'UserCookiePreference',
    tableName: 'user_cookie_preferences',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId'],
      },
    ],
  }
);

export default UserCookiePreference;

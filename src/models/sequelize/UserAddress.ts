import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';
import { UserAddressAttributes } from '@/models/UserAddress';

interface UserAddressCreationAttributes extends Optional<UserAddressAttributes, 'id' | 'createdAt'> {}

class UserAddress extends Model<UserAddressAttributes, UserAddressCreationAttributes> implements UserAddressAttributes {
  declare id: number;
  declare addressId: number;
  declare userId: number;
  declare createdAt: Date;
}

UserAddress.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserAddress',
    tableName: 'user_addresses',
    timestamps: false,
    indexes: [
      {
        fields: ['userId'],
      },
    ],
  }
);

export default UserAddress;

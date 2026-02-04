import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';
import { AddressAttributes } from '@/models/Address';

// Define creation attributes (optional fields during creation)
interface AddressCreationAttributes extends Optional<AddressAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the Address model class
class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  declare id: number;
  declare city: string;
  declare province: string;
  declare postalCode: string;
  declare addressLine1: string;
  declare addressLine2?: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

// Initialize the Address model
Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    addressLine1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    addressLine2: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: true,
  }
);

export default Address;

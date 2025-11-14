import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

// Define the Address attributes interface
interface AddressAttributes {
  id: number;
  userId: number;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define creation attributes (optional fields during creation)
interface AddressCreationAttributes extends Optional<AddressAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the Address model class
class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  declare id: number;
  declare userId: number;
  declare street: string;
  declare city: string;
  declare province: string;
  declare postalCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Association methods will be added here later
}

// Initialize the Address model
Address.init(
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
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    indexes: [
      {
        unique: true,
        fields: ['userId'], // Ensures one address per user
      },
    ],
  }
);

export default Address;

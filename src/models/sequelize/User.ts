import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

// Define the User attributes interface
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  fullName: string;
  status: 'Active' | 'Pending' | 'Inactive' | 'Banned';
  createdAt: Date;
  updatedAt: Date;
  roleId: number;
}

// Define creation attributes (optional fields during creation)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare password: string;
  declare fullName: string;
  declare status: 'Active' | 'Pending' | 'Inactive' | 'Banned';
  declare createdAt: Date;
  declare updatedAt: Date;
  declare roleId: number;

  // Association methods will be added here later
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Pending', 'Inactive', 'Banned'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
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
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

export default User;

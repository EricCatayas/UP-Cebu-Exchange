import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

// Define the Role attributes interface
interface RoleAttributes {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define creation attributes
interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}

// Define the Role model class
class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the Role model
Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
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
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
  }
);

export default Role;
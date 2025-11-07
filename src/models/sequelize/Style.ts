import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

// Define the Style attributes interface
interface StyleAttributes {
  id: number;
  name: string;
}

// Define creation attributes
interface StyleCreationAttributes extends Optional<StyleAttributes, 'id'> {}

// Define the Style model class
class Style extends Model<StyleAttributes, StyleCreationAttributes> implements StyleAttributes {
  public id!: number;
  public name!: string;
}

// Initialize the Style model
Style.init(
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
  },
  {
    sequelize,
    modelName: 'Style',
    tableName: 'styles',
    timestamps: false, // Styles are typically static data
    indexes: [
      {
        unique: true,
        fields: ['name'],
      },
    ],
  }
);

export default Style;
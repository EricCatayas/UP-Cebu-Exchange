import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface ArtistAttributes {
  id: number;
  name: string;
  biography?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define creation attributes
interface ArtistCreationAttributes extends Optional<ArtistAttributes, 'id' | 'biography' | 'createdAt' | 'updatedAt'> {}

// Define the Artist model class
class Artist extends Model<ArtistAttributes, ArtistCreationAttributes> implements ArtistAttributes {
  public id!: number;
  public name!: string;
  public biography!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the Artist model
Artist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    biography: {
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
    modelName: 'Artist',
    tableName: 'artists',
    timestamps: true,
  }
);

export default Artist;
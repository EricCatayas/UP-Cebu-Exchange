import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

// Define the Artwork attributes interface
interface ArtworkAttributes {
  id: number;
  title: string;
  artistId?: number;
  description?: string;
  medium: string;
  heightCm: number;
  widthCm: number;
  status: string;
  createdAt: Date;
  updatedAt: Date; 
}

// Define creation attributes
interface ArtworkCreationAttributes extends Optional<ArtworkAttributes, 'id' | 'artistId' | 'description' | 'status' | 'createdAt' | 'updatedAt'> {}

// Define the Artwork model class
class Artwork extends Model<ArtworkAttributes, ArtworkCreationAttributes> implements ArtworkAttributes {
  public id!: number;
  public title!: string;
  public artistId!: number;
  public description!: string;
  public medium!: string;
  public heightCm!: number;
  public widthCm!: number;
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the Artwork model
Artwork.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Artist',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    medium: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    heightCm: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    widthCm: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'available',
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
    modelName: 'Artwork',
    tableName: 'artworks',
    timestamps: true,
    indexes: [
      {
        fields: ['artistId'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default Artwork;
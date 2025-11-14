import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

// Define the Artwork attributes interface
interface ArtworkAttributes {
  id: number;
  title?: string;
  artistId?: number;
  description?: string;
  medium: string;
  styleId?: number;
  heightCm?: number;
  widthCm?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define creation attributes
interface ArtworkCreationAttributes
  extends Optional<
    ArtworkAttributes,
    | 'id'
    | 'artistId'
    | 'title'
    | 'description'
    | 'styleId'
    | 'heightCm'
    | 'widthCm'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
  > {}

// Define the Artwork model class
class Artwork extends Model<ArtworkAttributes, ArtworkCreationAttributes> implements ArtworkAttributes {
  declare id: number;
  declare title: string;
  declare artistId: number;
  declare description: string;
  declare medium: string;
  declare styleId: number;
  declare heightCm: number;
  declare widthCm: number;
  declare status: string;
  declare createdAt: Date;
  declare updatedAt: Date;
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
      allowNull: true,
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'artists',
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
    styleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'styles',
        key: 'id',
      },
    },
    heightCm: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    widthCm: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
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
      {
        fields: ['styleId'],
      },
    ],
  }
);

export default Artwork;

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface ArtworkImageAttributes {
  id: number;
  artworkId: number;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: Date;
}

interface ArtworkImageCreationAttributes extends Optional<ArtworkImageAttributes, 'id' | 'isPrimary' | 'createdAt'> {}

class ArtworkImage
  extends Model<ArtworkImageAttributes, ArtworkImageCreationAttributes>
  implements ArtworkImageAttributes
{
  declare id: number;
  declare artworkId: number;
  declare imageUrl: string;
  declare isPrimary: boolean;
  declare createdAt: Date;
}

ArtworkImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    artworkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'artworks',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'ArtworkImage',
    tableName: 'artwork_images',
    timestamps: false,
    indexes: [
      {
        fields: ['artworkId'],
      },
      {
        fields: ['artworkId', 'isPrimary'],
      },
    ],
  }
);

export default ArtworkImage;

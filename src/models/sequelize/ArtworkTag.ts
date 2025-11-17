import { DataTypes, Model } from 'sequelize';
import sequelize from '@/config/database';
import { ArtworkTagAttributes } from '@/models/ArtworkTag';

class ArtworkTag extends Model<ArtworkTagAttributes> implements ArtworkTagAttributes {
  declare artworkId: number;
  declare tagId: number;
}

ArtworkTag.init(
  {
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
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'ArtworkTag',
    tableName: 'artwork_tags',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['artworkId', 'tagId'],
      },
      {
        fields: ['artworkId'],
      },
      {
        fields: ['tagId'],
      },
    ],
  }
);

export default ArtworkTag;

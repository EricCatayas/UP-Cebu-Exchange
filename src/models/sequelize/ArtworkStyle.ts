import { DataTypes, Model } from 'sequelize';
import sequelize from '@/config/database';

// Define the ArtworkStyle attributes interface
interface ArtworkStyleAttributes {
  artworkId: number;
  styleId: number;
}

// Define the ArtworkStyle model class
class ArtworkStyle extends Model<ArtworkStyleAttributes> implements ArtworkStyleAttributes {
  public artworkId!: number;
  public styleId!: number;
}

// Initialize the ArtworkStyle model
ArtworkStyle.init(
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
    styleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'styles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'ArtworkStyle',
    tableName: 'artwork_styles',
    timestamps: false, // Junction tables typically don't need timestamps
    indexes: [
      {
        unique: true,
        fields: ['artworkId', 'styleId'], // Composite primary key
      },
      {
        fields: ['artworkId'],
      },
      {
        fields: ['styleId'],
      },
    ],
  }
);

export default ArtworkStyle;
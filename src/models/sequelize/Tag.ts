import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface TagAttributes {
  id: number;
  name: string;
}

interface TagCreationAttributes extends Optional<TagAttributes, 'id'> {}

class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
  public id!: number;
  public name!: string;
}

Tag.init(
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
    modelName: 'Tag',
    tableName: 'tags',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['name'],
      },
    ],
  }
);

export default Tag;
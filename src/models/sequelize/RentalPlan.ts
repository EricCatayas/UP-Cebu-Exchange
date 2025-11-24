import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';
import { RentalPlanAttributes } from '@/models/RentalPlan';

interface RentalPlanCreationAttributes extends Optional<RentalPlanAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class RentalPlan extends Model<RentalPlanAttributes, RentalPlanCreationAttributes> implements RentalPlanAttributes {
  declare id: number;
  declare artworkId: number;
  declare durationMonths: number;
  declare rentalFee: number;
  declare price: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

RentalPlan.init(
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
    durationMonths: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[3, 6, 12]],
      },
    },
    rentalFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
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
    modelName: 'RentalPlan',
    tableName: 'rental_plans',
    timestamps: true,
    indexes: [
      {
        fields: ['artworkId'],
      },
      {
        unique: true,
        fields: ['artworkId', 'durationMonths'],
      },
    ],
  }
);

export default RentalPlan;

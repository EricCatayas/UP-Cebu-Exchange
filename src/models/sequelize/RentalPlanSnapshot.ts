import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/database';

interface RentalPlanSnapshotAttributes {
  id: number;
  originalRentalPlanId: number;
  rentalOrderItemId: number;
  durationMonths: number;
  rentalFee: number;
  createdAt: Date;
}

interface RentalPlanSnapshotCreationAttributes extends Optional<RentalPlanSnapshotAttributes, 'id' | 'createdAt'> {}

class RentalPlanSnapshot extends Model<RentalPlanSnapshotAttributes, RentalPlanSnapshotCreationAttributes> implements RentalPlanSnapshotAttributes {
  public id!: number;
  public originalRentalPlanId!: number;
  public rentalOrderItemId!: number;
  public durationMonths!: number;
  public rentalFee!: number;
  public createdAt!: Date;
}

RentalPlanSnapshot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    originalRentalPlanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rentalOrderItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'RentalPlanSnapshot',
    tableName: 'rental_plans',
    timestamps: true,
  }
);

export default RentalPlanSnapshot;
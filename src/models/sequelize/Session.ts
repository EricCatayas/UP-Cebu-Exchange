import sequelize from '@/config/database';
import { SessionAttributes } from '@/models/Session';
import { DataTypes, Model, Optional } from 'sequelize';

interface SessionCreationAttributes extends Optional<SessionAttributes, 'id' | 'userId' | 'createdAt' | 'lastSeenAt'> {}

class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  declare id: number;
  declare sessionId: string;
  declare userId?: number;
  declare createdAt: Date;
  declare lastSeenAt: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Session',
    tableName: 'sessions',
    timestamps: false,
    indexes: [
      {
        fields: ['sessionId'],
      },
      {
        fields: ['userId'],
      },
    ],
  }
);

export default Session;

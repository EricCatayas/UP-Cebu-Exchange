import sequelize from '@/config/database';
import { DataTypes, Model, Optional } from 'sequelize';
import { EventAttributes } from '@/models/Event';

// Define creation attributes
interface EventCreationAttributes
  extends Optional<EventAttributes, 'id' | 'entity_type' | 'entity_id' | 'metadata' | 'createdAt'> {}

// Define the Event model class
class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  declare id: number;
  declare sessionId: number;
  declare name: string;
  declare category: string;
  declare entity_type?: string;
  declare entity_id?: number;
  declare metadata?: string;
  declare createdAt: Date;
}

// Initialize the Event model
Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sessions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: false,
    updatedAt: false,
    indexes: [
      {
        fields: ['sessionId'],
      },
      {
        fields: ['name'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['entity_type', 'entity_id'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

export default Event;

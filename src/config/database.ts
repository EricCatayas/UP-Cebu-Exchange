import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file BEFORE importing anything else
config({ path: resolve(process.cwd(), '.env.local') });

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'up_cebu_exchange',
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
});

export default sequelize;

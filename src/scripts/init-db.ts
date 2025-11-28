import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import '@/models/sequelize';

import DatabaseService from '@/lib/database';

import { seedDatabase } from './seed';

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...');

    const dbService = DatabaseService.getInstance();

    // Test connection
    await dbService.connect();

    // Sync all models (create tables)
    await dbService.sync({ force: false }); // Set to true to drop existing tables

    console.log('✅ All tables created successfully!');

    // Await seed database
    await seedDatabase();

    console.log('✅ Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database setup completed. You can now start your application.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

export { initializeDatabase, seedDefaultRoles };

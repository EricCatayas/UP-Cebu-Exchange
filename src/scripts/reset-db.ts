import DatabaseService from '@/lib/database';
import { initializeDatabase } from './init-db';

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');
    
    const dbService = DatabaseService.getInstance();
    
    // Test connection
    await dbService.connect();
    
    // Sync all models with force: true (drops and recreates tables)
    await dbService.sync({ force: true });
    
    console.log('✅ Database reset completed!');
    
    // Re-seed default data
    console.log('🌱 Re-seeding database...');
    await initializeDatabase();
    
    console.log('✅ Database reset and initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('Database reset completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database reset failed:', error);
      process.exit(1);
    });
}

export { resetDatabase };
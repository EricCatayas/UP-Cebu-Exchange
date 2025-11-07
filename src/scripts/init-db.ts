import DatabaseService from '@/lib/database';
import { Role } from '@/models/sequelize';

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...');
    
    const dbService = DatabaseService.getInstance();
    
    // Test connection
    await dbService.connect();
    
    // Sync all models (create tables)
    await dbService.sync({ force: false }); // Set to true to drop existing tables
    
    // Seed default roles
    await seedDefaultRoles();
    
    console.log('✅ Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function seedDefaultRoles() {
  try {
    console.log('🌱 Seeding default roles...');
    
    const defaultRoles = [
      { name: 'admin', description: 'Administrator with full access' },
      { name: 'customer', description: 'Customer who can rent artworks' },
      { name: 'artist', description: 'Artist who can list artworks' },
    ];

    for (const roleData of defaultRoles) {
      const [role, created] = await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: roleData,
      });
      
      if (created) {
        console.log(`✅ Created role: ${role.name}`);
      } else {
        console.log(`ℹ️  Role already exists: ${role.name}`);
      }
    }
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
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
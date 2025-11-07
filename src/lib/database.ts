import sequelize from '@/config/database';

class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully.');
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error);
      throw error;
    }
  }

  public async sync(options?: { force?: boolean; alter?: boolean }): Promise<void> {
    try {
      await sequelize.sync(options);
      console.log('✅ Database models synchronized successfully.');
    } catch (error) {
      console.error('❌ Database sync failed:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      await sequelize.close();
      console.log('✅ Database connection closed.');
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
      throw error;
    }
  }

  public getSequelize() {
    return sequelize;
  }
}

export default DatabaseService;
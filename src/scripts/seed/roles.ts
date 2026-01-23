import Role from '@/models/sequelize/Role';
import { USER_ROLE } from '@/lib/constants';

export async function seedDefaultRoles() {
  try {
    console.log('🌱 Seeding default roles...');

    const defaultRoles = [
      { name: USER_ROLE.HEAD, description: 'Administrator with read-only access' },
      { name: USER_ROLE.STAFF, description: 'Staff who can modify content' },
      { name: USER_ROLE.CUSTOMER, description: 'Customer who can rent artworks' },
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

import User from '@/models/sequelize/User';
import Role from '@/models/sequelize/Role';
import { USER_ROLE } from '@/lib/constants';
import { hashPassword } from '@/lib/auth';

export async function seedUsers() {
  try {
    const customerRole = await Role.findOne({
      where: { name: USER_ROLE.CUSTOMER },
    });
    const staffRole = await Role.findOne({
      where: { name: USER_ROLE.STAFF },
    });
    const adminRole = await Role.findOne({
      where: { name: USER_ROLE.ADMIN },
    });

    // customer account
    const userPassword = await hashPassword('user123');
    await User.findOrCreate({
      where: { email: 'user1@test.com' },
      defaults: {
        email: 'user1@test.com',
        fullName: 'User One',
        password: userPassword,
        phoneNumber: '123-456-7890',
        roleId: customerRole.id,
        status: 'Active',
      },
    });
    // staff account
    const staffPassword = await hashPassword('staff123');
    await User.findOrCreate({
      where: { email: 'staff1@test.com' },
      defaults: {
        email: 'staff1@test.com',
        fullName: 'Staff User',
        password: staffPassword,
        phoneNumber: '555-1234',
        roleId: staffRole.id,
        status: 'Active',
      },
    });
    // admin account
    const adminPassword = await hashPassword('admin123');
    await User.findOrCreate({
      where: { email: 'admin@test.com' },
      defaults: {
        email: 'admin@test.com',
        fullName: 'Admin User',
        password: adminPassword,
        phoneNumber: '987-654-3210',
        roleId: adminRole.id,
        status: 'Active',
      },
    });
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

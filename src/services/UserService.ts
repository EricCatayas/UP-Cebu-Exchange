import { User, Role } from '@/models/sequelize';
import { UserDTO } from '@/models/User';
import { ADMIN_ROLES, USER_ROLE } from '@/lib/constants';
import { Op } from 'sequelize';

class UserService {
  async getUserById(userId: number): Promise<UserDTO | null> {
    const user = await User.findByPk(userId, { include: ['role'] });
    if (!user) return null;
    const userJson = user.toJSON() as any;
    return {
      id: userJson.id,
      email: userJson.email,
      fullName: userJson.fullName,
      phoneNumber: userJson.phoneNumber,
      status: userJson.status,
      createdAt: userJson.createdAt,
      updatedAt: userJson.updatedAt,
      roleId: userJson.roleId,
      role: userJson.role,
    };
  }

  async getCustomers(): Promise<UserDTO[]> {
    return this.getUsersByRole(USER_ROLE.CUSTOMER);
  }

  async getUsersByRole(role: string): Promise<UserDTO[]> {
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (!roleRecord) throw new Error(`Role ${role} not found`);
    const users = await User.findAll({ where: { roleId: roleRecord.id } });
    return users.map((user) => {
      const userJson = user.toJSON() as any;
      return {
        id: userJson.id,
        email: userJson.email,
        fullName: userJson.fullName,
        phoneNumber: userJson.phoneNumber,
        status: userJson.status,
        createdAt: userJson.createdAt,
        updatedAt: userJson.updatedAt,
        roleId: userJson.roleId,
        role: roleRecord.toJSON(),
      };
    });
  }

  async getAdminUsers(): Promise<UserDTO[]> {
    const adminRoles = await Role.findAll({ where: { name: { [Op.in]: ADMIN_ROLES } } });
    if (!adminRoles) throw new Error('Staff role not found');
    const users = await User.findAll({ where: { roleId: adminRoles.map((role) => role.id) }, include: ['role'] });
    return users.map((user) => {
      const userJson = user.toJSON() as any;
      return {
        id: userJson.id,
        email: userJson.email,
        fullName: userJson.fullName,
        phoneNumber: userJson.phoneNumber,
        status: userJson.status,
        createdAt: userJson.createdAt,
        updatedAt: userJson.updatedAt,
        roleId: userJson.roleId,
        role: userJson.role,
      };
    });
  }

  async getCustomerRoleId(): Promise<number> {
    const id = await this.getRoleIdByName(USER_ROLE.CUSTOMER);
    if (!id) {
      throw new Error('Customer role not found');
    }
    console.log('Customer Role ID:', id);
    return id;
  }

  private async getRoleIdByName(roleName: string): Promise<number | null> {
    const role = await Role.findOne({ where: { name: roleName } });
    return role ? role.id : null;
  }
}

export default UserService;

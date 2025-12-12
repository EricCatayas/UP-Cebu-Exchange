import { User, Role } from '@/models/sequelize';
import { UserDTO } from '@/models/User';

class UserService {
  async getUserById(userId: number): Promise<UserDTO | null> {
    const user = await User.findByPk(userId, { include: ['role'] });
    if (!user) return null;
    const userJson = user.toJSON() as any;
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roleId: user.roleId,
      role: userJson.role,
    };
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
        role: roleRecord,
      };
    });
  }
}

export default UserService;

import { User, Role } from '@/models/sequelize';
import { UserDTO } from '@/models/User';

class UserService {
  async getUserById(userId: number): Promise<UserDTO | null> {
    const user = await User.findByPk(userId);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roleId: user.roleId,
    };
  }

  async getUsersByRole(role: string): Promise<UserDTO[]> {
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (!roleRecord) throw new Error(`Role ${role} not found`);
    const users = await User.findAll({ where: { roleId: roleRecord.id } });
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roleId: user.roleId,
    }));
  }
}

export default UserService;

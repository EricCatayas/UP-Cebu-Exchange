import { RoleDTO } from '@/models/Role';
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  fullName: string;
  status: 'Active' | 'Pending' | 'Inactive' | 'Banned';
  createdAt: Date;
  updatedAt: Date;
  roleId: number;
}

export interface UserDTO extends Omit<UserAttributes, 'password'> {
  role: RoleDTO;
}

export interface UserCreateDTO {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

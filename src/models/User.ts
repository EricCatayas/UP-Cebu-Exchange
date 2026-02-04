import { RoleDTO } from '@/models/Role';
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
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
  fullName: string;
  phoneNumber: string;
  password: string;
  role: string;
}

export interface UserEditDTO {
  fullName: string;
  status: string;
  phoneNumber: string;
  role: string;
}

export interface UserUpdateDTO {
  fullName?: string;
  phoneNumber?: string;
  password?: string;
  newPassword?: string;
  role?: string;
}

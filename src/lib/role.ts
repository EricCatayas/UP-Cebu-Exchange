import { JWTPayload, User } from '@/types/auth';
import { ADMIN_ROLES, ADMIN_EDITOR_ROLES, USER_ROLE } from './constants';

export const isAdmin = (user: JWTPayload | User | null): boolean => {
  const roleName = user?.roleName?.toLowerCase() || user?.role?.name?.toLowerCase();
  return ADMIN_ROLES.includes(roleName || '');
};

export const isCustomer = (user: JWTPayload | User | null): boolean => {
  const roleName = user?.roleName?.toLowerCase() || user?.role?.name?.toLowerCase();
  return roleName === USER_ROLE.CUSTOMER.toLowerCase();
};

export const canEditContent = (user: JWTPayload | User | null): boolean => {
  const roleName = user?.roleName?.toLowerCase() || user?.role?.name?.toLowerCase();
  return ADMIN_EDITOR_ROLES.includes(roleName || '');
};

export const canManageUsers = (user: JWTPayload | User | null): boolean => {
  const roleName = user?.roleName?.toLowerCase() || user?.role?.name?.toLowerCase() || '';
  return roleName === USER_ROLE.ADMIN.toLowerCase();
};

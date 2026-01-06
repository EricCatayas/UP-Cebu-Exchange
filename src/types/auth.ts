export interface User {
  id: number;
  email: string;
  fullName: string;
  roleId: number;
  roleName: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
  exp?: number;
}

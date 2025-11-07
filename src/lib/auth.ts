import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const SALT_ROUNDS = 12;

// Password hashing utilities
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// JWT token utilities
export interface JWTPayload {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
  exp?: number;
}

export const generateToken = (payload: Omit<JWTPayload, 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

// Session management utilities
export const setAuthCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
};

export const removeAuthCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
};

export const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');
  return token?.value || null;
};

export const getCurrentUser = async (): Promise<JWTPayload | null> => {
  const token = await getAuthToken();
  if (!token) return null;
  
  return verifyToken(token);
};

// Role checking utilities
export const isAdmin = (user: JWTPayload | null): boolean => {
  return user?.roleName?.toLowerCase() === 'admin';
};

export const isCustomer = (user: JWTPayload | null): boolean => {
  return user?.roleName?.toLowerCase() === 'customer';
};

export const hasRole = (user: JWTPayload | null, roleName: string): boolean => {
  return user?.roleName?.toLowerCase() === roleName.toLowerCase();
};
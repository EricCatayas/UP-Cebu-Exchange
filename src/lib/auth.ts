import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { JWTPayload, User } from '@/types/auth';
import { ADMIN_ROLES, USER_ROLE } from './constants';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const SALT_ROUNDS = 12;

// Password hashing utilities
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: Omit<JWTPayload, 'exp'>, rememberMe: boolean = false): string => {
  const expiresIn = rememberMe ? '30d' : '7d';
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

/**
 * 
 * Cookie-based Auth (Current Approach) ✅
    Token is automatically sent with every request via cookies
    Protected from XSS attacks (JavaScript can't access it)
    Automatically handled by the browser
    Better for server-side rendering (Next.js App Router)
    Client need not manually store and access token in localStorage
 */
export const setAuthCookie = async (token: string, rememberMe: boolean = false) => {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 days or 7 days
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
export const isAdmin = (user: JWTPayload | User | null): boolean => {
  return ADMIN_ROLES.includes(user?.roleName?.toLowerCase() || '');
};

export const isCustomer = (user: JWTPayload | User | null): boolean => {
  return user?.roleName?.toLowerCase() === USER_ROLE.CUSTOMER.toLowerCase();
};

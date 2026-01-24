import crypto from 'crypto';
import { hashPassword } from '@/lib/auth';
import { DURATION_OPTIONS } from './constants';

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateEmail(): string {
  const randomString = crypto.randomBytes(8).toString('hex');
  return `${randomString}@example.com`;
}

export async function generatePassword(): Promise<string> {
  const password = crypto.randomBytes(8).toString('hex');
  return await hashPassword(password);
}

export function generateFullName(): string {
  const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Thomas'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

export function generatePhoneNumber(): string {
  const areaCode = Math.floor(100 + Math.random() * 900);
  const centralOfficeCode = Math.floor(100 + Math.random() * 900);
  const lineNumber = Math.floor(1000 + Math.random() * 9000);
  return `${areaCode}-${centralOfficeCode}-${lineNumber}`;
}

export function generateRandomDuration(): number {
  const durations = DURATION_OPTIONS.map((option) => option);
  return durations[Math.floor(Math.random() * durations.length)];
}

export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomString(length: number): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

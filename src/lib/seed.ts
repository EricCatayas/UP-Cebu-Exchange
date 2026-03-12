import crypto from 'crypto';
import { hashPassword } from '@/lib/auth';
import { DELIVERY_METHOD, DELIVERY_METHODS, DURATION_OPTIONS } from './constants';

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
  return DURATION_OPTIONS[Math.floor(Math.random() * DURATION_OPTIONS.length)];
}

export function generateDeliveryMethod(): string {
  const deliveryMethods = DELIVERY_METHODS;
  return deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)];
}

export function generateStartAndEndDates(durationMonths: number): { startDate: Date; endDate: Date } {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + durationMonths);
  return { startDate, endDate };
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

export function generatePaymentIntentId(): string {
  return `pi_${generateRandomString(24)}`;
}

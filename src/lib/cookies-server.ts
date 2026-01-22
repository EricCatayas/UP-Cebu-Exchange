import { cookies } from 'next/headers';
import { CookiePreference } from './cookies';

// ============ SERVER-SIDE UTILITIES ============

const COOKIE_PREFERENCE_KEY = 'cookie-consent-preference';

/**
 * Set cookie preference in HTTP cookie
 * Use this in server components or API routes
 */
export async function setCookiePreference(preference: 'accept' | 'reject'): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_PREFERENCE_KEY, preference, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });
}

/**
 * Get cookie preference from HTTP cookie
 * Use this in server components or API routes
 */
export async function getCookiePreference(): Promise<CookiePreference> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_PREFERENCE_KEY);
  return (cookie?.value as CookiePreference) || null;
}

/**
 * Check if cookies are accepted on server
 */
export async function areCookiesAccepted(): Promise<boolean> {
  return (await getCookiePreference()) === 'accept';
}

/**
 * Check if cookies are rejected on server
 */
export async function areCookiesRejected(): Promise<boolean> {
  return (await getCookiePreference()) === 'reject';
}

/**
 * Check if user has made a choice on server
 */
export async function hasUserChosenCookiePreference(): Promise<boolean> {
  return (await getCookiePreference()) !== null;
}

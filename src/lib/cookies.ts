'use client';

// ============ CLIENT-SIDE UTILITIES ============

const COOKIE_PREFERENCE_KEY = 'cookie-consent';

export type CookiePreference = 'accept' | 'reject' | null;

// ============ CLIENT-SIDE UTILITIES ============

/**
 * Store cookie preference in localStorage (CLIENT-SIDE ONLY)
 */
export function setCookiePreference(preference: 'accept' | 'reject'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(COOKIE_PREFERENCE_KEY, preference);
  }
}

/**
 * Get stored cookie preference from localStorage (CLIENT-SIDE ONLY)
 */
export function getCookiePreference(): CookiePreference {
  if (typeof window === 'undefined') {
    return null;
  }
  return (localStorage.getItem(COOKIE_PREFERENCE_KEY) as CookiePreference) || null;
}

/**
 * Check if cookies are accepted (CLIENT-SIDE ONLY)
 */
export function areCookiesAccepted(): boolean {
  return getCookiePreference() === 'accept';
}

/**
 * Check if cookies are rejected (CLIENT-SIDE ONLY)
 */
export function areCookiesRejected(): boolean {
  return getCookiePreference() === 'reject';
}

/**
 * Check if user has made a choice (CLIENT-SIDE ONLY)
 */
export function hasUserChosenCookiePreference(): boolean {
  return getCookiePreference() !== null;
}

/**
 * Clear cookie preference (CLIENT-SIDE ONLY)
 */
export function clearCookiePreference(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(COOKIE_PREFERENCE_KEY);
  }
}

export function canTrackCookies(): boolean {
  return areCookiesAccepted();
}

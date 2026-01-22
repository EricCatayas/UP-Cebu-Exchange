'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getCookiePreference, setCookiePreference, hasUserChosenCookiePreference } from '@/lib/cookies';

interface CookieContextType {
  cookiePreference: 'accept' | 'reject' | null;
  hasChosenPreference: boolean;
  acceptCookies: () => void;
  rejectCookies: () => void;
  canTrack: () => boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [cookiePreference, setCookiePreferenceState] = useState<'accept' | 'reject' | null>(null);
  const [hasChosenPreference, setHasChosenPreference] = useState(false);

  // Initialize from localStorage on client
  useEffect(() => {
    const preference = getCookiePreference();
    setCookiePreferenceState(preference);
    setHasChosenPreference(hasUserChosenCookiePreference());
  }, []);

  const acceptCookies = async () => {
    setCookiePreference('accept');
    setCookiePreferenceState('accept');
    await setCookiePreferenceServer('accept');
    setHasChosenPreference(true);
  };

  const rejectCookies = async () => {
    setCookiePreference('reject');
    setCookiePreferenceState('reject');
    await setCookiePreferenceServer('reject');
    setHasChosenPreference(true);
  };

  const canTrack = () => {
    return cookiePreference === 'accept';
  };

  const setCookiePreferenceServer = async (preference: 'accept' | 'reject') => {
    await fetch('/api/session/cookies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preference }),
    });
  };

  return (
    <CookieContext.Provider
      value={{
        cookiePreference,
        hasChosenPreference,
        acceptCookies,
        rejectCookies,
        canTrack,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}

export function useCookie() {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookie must be used within a CookieProvider');
  }
  return context;
}

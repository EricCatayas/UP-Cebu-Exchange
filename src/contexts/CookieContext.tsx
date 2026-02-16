'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  CookiePreference,
  getCookiePreference,
  setCookiePreference,
  hasUserChosenCookiePreference,
} from '@/lib/cookies';
import { isAdmin } from '@/lib/role';

interface CookieContextType {
  cookiePreference: 'accept' | 'reject' | null;
  hasChosenPreference: boolean;
  acceptCookies: () => void;
  rejectCookies: () => void;
  canTrack: boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [cookiePreference, setCookiePreferenceState] = useState<'accept' | 'reject' | null>(null);
  const [hasChosenPreference, setHasChosenPreference] = useState(false);
  const [canTrack, setCanTrack] = useState(false);
  const { user } = useAuth();

  const persistPreference = async (preference: Exclude<CookiePreference, null>) => {
    if (!user) return;
    try {
      await fetch('/api/cookie-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preference }),
      });
    } catch (error) {
      console.error('Failed to save cookie preference:', error);
    }
  };

  const applyPreference = async (preference: Exclude<CookiePreference, null>, persist: boolean = true) => {
    setCookiePreference(preference);
    setCookiePreferenceState(preference);
    setHasChosenPreference(true);
    setCanTrack(preference === 'accept');
    if (persist) {
      await persistPreference(preference);
    }
  };

  const acceptCookies = async () => {
    await applyPreference('accept');
  };

  const rejectCookies = async () => {
    await applyPreference('reject');
  };

  // Initialize from localStorage on client
  useEffect(() => {
    const preference = getCookiePreference();
    setCookiePreferenceState(preference);
    setHasChosenPreference(hasUserChosenCookiePreference());
    setCanTrack(preference === 'accept');
  }, []);

  useEffect(() => {
    if (!user) return;

    if (isAdmin(user)) {
      acceptCookies();
      return;
    }

    const syncPreference = async () => {
      try {
        const response = await fetch('/api/cookie-preference');
        if (!response.ok) {
          return;
        }
        const data: { preference: CookiePreference } = await response.json();
        if (data.preference) {
          await applyPreference(data.preference, false);
          return;
        }

        const localPreference = getCookiePreference();
        if (localPreference) {
          await persistPreference(localPreference);
        }
      } catch (error) {
        console.error('Failed to sync cookie preference:', error);
      }
    };

    syncPreference();
  }, [user]);

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

'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useCookie } from '@/contexts/CookieContext';

interface SessionContextType {
  sessionId: string | null;
  isLoading: boolean;
  // createNewSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { canTrack } = useCookie();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prevCanTrack, setPrevCanTrack] = useState<boolean | null>(null);

  const endSession = async () => {
    try {
      const response = await fetch('/api/session/end', {
        method: 'POST',
        keepalive: true, // Ensures request completes even if page is unloading
      });
      if (response.ok) {
        console.log('Session ended successfully');
        setSessionId(null);
      }
    } catch (error) {
      console.error('End session failed:', error);
    }
  };

  // Create session on canTrack change
  useEffect(() => {
    const fetchOrCreateSession = async () => {
      if (!canTrack) {
        setSessionId(null);
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/session');
        if (response.ok) {
          const data = await response.json();
          setSessionId(data.sessionId);
        } else {
          setSessionId(null);
        }
      } catch (error) {
        console.error('Session fetch failed:', error);
        setSessionId(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrCreateSession();
  }, [canTrack]);

  // End session when canTrack changes from true to false
  // i.e user later rejects cookies
  useEffect(() => {
    if (prevCanTrack === true && canTrack === false) {
      endSession();
    }
    setPrevCanTrack(canTrack);
  }, [canTrack]);

  // // Check session on mount
  // useEffect(() => {
  //   const fetchSession = async () => {
  //     try {
  //       const response = await fetch('/api/session');
  //       if (response.ok) {
  //         const data = await response.json();
  //         setSessionId(data.sessionId);
  //       } else {
  //         setSessionId(null);
  //       }
  //     } catch (error) {
  //       console.error('Session fetch failed:', error);
  //       setSessionId(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchSession();
  // }, []);

  const value = useMemo(
    () => ({
      sessionId,
      isLoading,
      // createNewSession,
    }),
    [sessionId, isLoading]
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

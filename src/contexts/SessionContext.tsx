'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface SessionContextType {
  sessionId: string | null;
  isLoading: boolean;
  // createNewSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Check session on mount
  useEffect(() => {
    const fetchSession = async () => {
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
    fetchSession();
  }, []);

  // Todo: Runs on page reload instead of browser close. Hard to fix
  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     if (sessionId) {
  //       navigator.sendBeacon('/api/session/end');
  //     }
  //   };

  //   // Listen for browser/tab close
  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   // Cleanup function - called when component unmounts
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);

  //     if (sessionId) {
  //       endSession();
  //     }
  //   };
  // }, [sessionId]);

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

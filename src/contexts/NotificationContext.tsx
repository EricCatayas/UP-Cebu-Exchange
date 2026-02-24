'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface NotificationContextType {
  hasNewNotifications: boolean;
  setHasNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    async function checkNotifications() {
      try {
        const response = await fetch('/api/notifications/new');
        if (response.ok) {
          const data = await response.json();
          setHasNewNotifications(data.notifications.length > 0);
          return;
        }

        console.error('Failed to check notifications:', response.statusText);
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    }

    checkNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ hasNewNotifications, setHasNewNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

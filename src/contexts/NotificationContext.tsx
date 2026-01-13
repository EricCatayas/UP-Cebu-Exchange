'use client';
import React, { createContext, useContext, useState, useMemo } from 'react';

interface NotificationContextType {
  hasNewNotifications: boolean;
  setHasNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children, hasNew = false }: { children: React.ReactNode; hasNew?: boolean }) {
  const [hasNewNotifications, setHasNewNotifications] = useState(hasNew);

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

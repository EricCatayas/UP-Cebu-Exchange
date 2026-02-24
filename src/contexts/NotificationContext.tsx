'use client';
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { NotificationDTO } from '@/models/Notification';
import { notificationApi } from '@/lib/api/notification';

interface NotificationContextType {
  notifications: NotificationDTO[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationDTO[]>>;
  newNotifications: NotificationDTO[];
  hasNewNotifications: boolean;
  read: (id: number) => Promise<void>;
  readAll: () => Promise<void>;
  remove: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const data = await response.json();
          const notificationsData = data.notifications;
          const newNotifs = notificationsData.filter((n: NotificationDTO) => !n.isRead);
          setHasNewNotifications(newNotifs.length > 0);
          setNotifications(notificationsData);
          return;
        }

        console.error('Failed to check notifications:', response.statusText);
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    }

    fetchNotifications();
  }, []);

  const newNotifications = useMemo(() => notifications.filter((n) => !n.isRead), [notifications]);

  const read = async (id: number) => {
    try {
      await notificationApi.read(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setHasNewNotifications(notifications.some((n) => n.id !== id && !n.isRead));
    } catch (error) {
      alert(error.message);
    }
  };

  const readAll = async () => {
    try {
      await notificationApi.readAll();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setHasNewNotifications(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const remove = async (id: number) => {
    try {
      await notificationApi.remove(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setHasNewNotifications(notifications.some((n) => n.id !== id && !n.isRead));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, newNotifications, hasNewNotifications, read, readAll, remove }}
    >
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

import React from 'react';
import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationService from '@/services/NotificationService';

const AdminLayout: React.FC = async ({ children }) => {
  const notificationService = new NotificationService();
  const hasNewNotifications = await notificationService.hasUnreadNotifications();
  return (
    <NotificationProvider hasNew={hasNewNotifications}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default AdminLayout;

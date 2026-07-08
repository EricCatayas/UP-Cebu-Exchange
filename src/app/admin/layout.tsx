import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import { NotificationProvider } from '@/contexts/NotificationContext';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const AdminLayout: React.FC = ({ children }: { children: React.ReactNode }) => {
  return (
    <NotificationProvider>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="container max-w-8xl mx-auto">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default AdminLayout;

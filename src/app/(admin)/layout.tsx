import React from 'react';
import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';

const AdminLayout: React.FC = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

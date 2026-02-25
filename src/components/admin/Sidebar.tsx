'use client';
import React from 'react';
import Link from 'next/link';
import { useNotification } from '@/contexts/NotificationContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaBox,
  FaUsers,
  FaMoneyBillWave,
  FaBell,
  FaChartBar,
  FaPalette,
  FaTruck,
} from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const { hasNewNotifications } = useNotification();
  const { isOpen, toggle } = useSidebar();

  const navItems = [
    { href: '/admin', icon: FaTachometerAlt, label: 'Dashboard' },
    { href: '/admin/calendar', icon: FaCalendarAlt, label: 'Calendar' },
    { href: '/admin/orders', icon: FaTruck, label: 'Orders' },
    { href: '/admin/inventory', icon: FaBox, label: 'Inventory' },
    { href: '/admin/users', icon: FaUsers, label: 'Users' },
    { href: '/admin/payments', icon: FaMoneyBillWave, label: 'Payments' },
    {
      href: '/admin/notifications',
      icon: FaBell,
      label: 'Notifications',
      hasNotification: hasNewNotifications,
    },
    { href: '/admin/reports', icon: FaChartBar, label: 'Reports' },
    { href: '/admin/themes', icon: FaPalette, label: 'Themes' },
  ];

  const navContent = (
    <nav className="mt-4">
      <ul>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="flex items-center p-2 hover:bg-gray-700">
              {item.icon && <item.icon className="mr-2" />}
              {item.hasNotification && (
                <span className="absolute ml-3 -mt-1 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
              )}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 h-screen w-64 bg-gray-800 text-white hidden md:flex flex-col">
        <div className="p-4">
          <Link href="/">
            <h2 className="text-lg font-bold">UP Cebu Exchange</h2>
          </Link>
        </div>
        {navContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggle} />
          <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white z-50 md:hidden flex flex-col shadow-lg animate-in slide-in-from-left duration-300">
            <div className="p-4 flex items-center justify-between">
              <Link href="/">
                <h2 className="text-lg font-bold">UP Cebu Exchange</h2>
              </Link>
              <button
                onClick={toggle}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>
            {navContent}
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;

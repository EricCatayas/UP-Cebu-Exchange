'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/calendar', label: 'Calendar' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/inventory', label: 'Inventory' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/payments', label: 'Payments' },
    { href: '/admin/notifications', label: 'Notifications' },
    { href: '/admin/reports', label: 'Reports' },
    { href: '/admin/themes', label: 'Themes' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedAccount = accountRef.current && accountRef.current.contains(target);
      const clickedMenu = menuRef.current && menuRef.current.contains(target);
      if (!clickedAccount) setAccountOpen(false);
      if (!clickedMenu) setMenuOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAccountOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <h1 className="text-2xl font-lora font-bold leading-tight bg-gradient-to-tr from-[#e53e44] to-[#e5ca48] bg-clip-text text-transparent relative md:hidden">
          UP Cebu Exchange
        </h1>
        <div> </div>
        <div className="flex items-end gap-4">
          <div className="relative" ref={accountRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((o) => !o)}
              className="font-light hover:text-gray-700 flex items-center"
            >
              {user?.name || 'Account'} <span className="ml-1">▾</span>
            </button>
            {accountOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5 py-1 z-50"
              >
                <Link href="/admin/profile" role="menuitem" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  role="menuitem"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
          <div className="relative md:hidden" ref={menuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="font-light hover:text-gray-700 flex items-center"
            >
              <FaBars />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black/5 py-1 z-50"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAccountOpen(false);
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
    router.push('/');
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{''}</h1>
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
      </div>
    </nav>
  );
};

export default Navbar;

'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { eventApi } from '@/lib/api/event';

const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

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
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleCartClick = () => {
    eventApi.beginCheckout(user?.id || null);
    router.push('/checkout');
  };

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    router.push('/');
    window.location.reload();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/100 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <h1 className="font-lora text-3xl font-bold">
              <span className="text-primary">UP</span> <span className="text-tertiary">Cebu</span>{' '}
              <span className="text-secondary">Exchange</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/artworks" className="font-light hover:text-gray-700">
            Gallery
          </Link>
          <Link href="/about" className="font-light hover:text-gray-700">
            About
          </Link>
          <Link href="/themes" className="font-light hover:text-gray-700">
            Themes
          </Link>
          {isLoggedIn ? (
            <>
              <button onClick={handleCartClick} className="font-light hover:text-gray-700">
                Cart
              </button>
              <Link href="/account/rentals" className="font-light hover:text-gray-700">
                My Rentals
              </Link>

              {/* Account dropdown */}
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((o) => !o)}
                  className="font-light hover:text-gray-700 flex items-center"
                >
                  Account <span className="ml-1">▾</span>
                </button>
                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5 py-1 z-50"
                  >
                    <Link href="/account/profile" role="menuitem" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      Profile
                    </Link>
                    <Link href="/account/wishlist" role="menuitem" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      Wishlist
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
            </>
          ) : (
            <>
              <Link href="/login" className="font-light hover:text-gray-700">
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

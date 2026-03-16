'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { FaCartShopping } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { FaBars, FaUser } from 'react-icons/fa';
import { isAdmin, isCustomer } from '@/lib/role';
import { eventApi } from '@/lib/api/event';

const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { sessionId } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { isOpen, toggle } = useSidebar();

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
    if (sessionId) eventApi.beginCheckout(user?.id || null);
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
          <div className="md:hidden">
            <button
              type="button"
              aria-haspopup="menu"
              onClick={toggle}
              className="font-light hover:text-gray-700 flex items-center"
            >
              <FaBars />
            </button>
          </div>
          <Link href="/" className="flex items-center h-full">
            <h1 className="font-lora text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#a70006] to-[#ffb224] bg-clip-text text-transparent leading-tight">
              UP Cebu Exchange
            </h1>
          </Link>
        </div>
        <div className="hidden md:block">
          <div className="flex items-center space-x-4">
            <Link href="/artworks" className="font-light hover:text-gray-700">
              Gallery
            </Link>
            <Link href="/about" className="font-light hover:text-gray-700">
              About
            </Link>
            <button onClick={handleCartClick} className="font-light hover:text-gray-700">
              Cart
            </button>

            {isLoggedIn ? (
              <>
                {isAdmin(user) ? (
                  <Link href="/admin" className="font-light hover:text-gray-700">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/account/rentals" className="font-light hover:text-gray-700">
                    My Rentals
                  </Link>
                )}

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
                      <Link
                        href={isAdmin(user) ? '/admin/profile' : '/account/profile'}
                        role="menuitem"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      {isCustomer(user) && (
                        <Link
                          href="/account/wishlist"
                          role="menuitem"
                          className="block px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Wishlist
                        </Link>
                      )}
                      <Link href="/settings" role="menuitem" className="block px-4 py-2 text-sm hover:bg-gray-50">
                        Settings
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
        <div className="md:hidden">
          <div className="flex items-center space-x-4">
            <button onClick={handleCartClick} className="font-light hover:text-gray-700 flex items-center">
              <FaCartShopping />
            </button>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="font-light hover:text-gray-700 flex items-center"
            >
              <FaUser />
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="relative" ref={accountRef}>
              {isLoggedIn ? (
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
                  <Link href="/settings" role="menuitem" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5 py-1 z-50"
                >
                  <Link href="/login" role="menuitem" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    role="menuitem"
                    className="block px-4 py-2 text-sm hover:bg-gray-50 text-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

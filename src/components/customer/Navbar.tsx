'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

// TODO: Navigation links
//      if signed in:  Cart, My Rentals, Account
//      if not signed in: Sign In/Register

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/100 backdrop-blur-sm shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <img
              src="/logo-placeholder.png"
              alt="Logo"
              className="h-12 w-12 max-w-12"
            />
          </Link>
          <h1 className="text-2xl font-bold">UP Cebu Exchange</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/checkout" className="font-light hover:text-gray-700">
            Cart
          </Link>
          <Link
            href="/account/rentals"
            className="font-light hover:text-gray-700"
          >
            My Rentals
          </Link>
          <Link href="/account" className="font-light hover:text-gray-700">
            Account
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

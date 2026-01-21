import React from 'react';
import Link from 'next/link';
import { APP_CONTACT_EMAIL } from '@/lib/constants';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" className="h-20 ml-8" />
          </Link>
          <div>
            <h3 className="text-lg font-bold mb-2">CONTACT</h3>
            <p className="text-sm">(+63) 987 654 3210</p>
            <p className="text-sm">
              <a href={`mailto:${APP_CONTACT_EMAIL}`}>{APP_CONTACT_EMAIL}</a>
            </p>
            <p className="text-sm">
              University Of The Philippines, Arts & Sciences Building, 3rd Floor, Gorordo Ave, Cebu City
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">ABOUT</h3>
            <Link href="/about">
              <p className="text-sm">About Us</p>
            </Link>
            <Link href="/faq">
              <p className="text-sm">FAQ</p>
            </Link>
            <Link href="/terms">
              <p className="text-sm">Terms of Use</p>
            </Link>
            <Link href="/privacy-policy">
              <p className="text-sm">Privacy Policy</p>
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">FOLLOW US</h3>
            <p className="text-sm">Facebook</p>
            <p className="text-sm">Twitter</p>
            <p className="text-sm">Instagram</p>
          </div>
        </div>
        <div className="text-center text-sm mt-6">
          &copy; {new Date().getFullYear()} UP Cebu Exchange. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

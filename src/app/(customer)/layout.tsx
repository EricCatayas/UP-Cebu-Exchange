import React from 'react';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import { CartProvider } from '@/contexts/CartContext';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CartProvider>
        <Navbar />
        {children}
        <Footer />
      </CartProvider>
    </>
  );
}

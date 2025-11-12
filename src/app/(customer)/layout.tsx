import React from 'react';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { RentalOrderProvider } from '@/contexts/RentalOrderContext';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CartProvider>
        <RentalOrderProvider>
          <Navbar />
          {children}
          <Footer />
        </RentalOrderProvider>
      </CartProvider>
    </>
  );
}

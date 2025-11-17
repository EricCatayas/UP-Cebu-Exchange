import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { RentalOrderProvider } from '@/contexts/RentalOrderContext';
import CartService from '@/services/CartService';
import { getCurrentUser } from '@/lib/auth';

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  const initialCartItems = currentUser ? await CartService.getCartItems(currentUser.userId) : [];
  console.log('Initial Cart Items:', initialCartItems);

  return (
    <>
      <CartProvider initialCartItems={initialCartItems}>
        <RentalOrderProvider>{children}</RentalOrderProvider>
      </CartProvider>
    </>
  );
}

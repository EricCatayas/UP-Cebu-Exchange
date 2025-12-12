import React from 'react';
import CartService from '@/services/CartService';
import AddressService from '@/services/AddressService';
import { CartProvider } from '@/contexts/CartContext';
import { RentalOrderProvider } from '@/contexts/RentalOrderContext';
import { UserAddressProvider } from '@/contexts/UserAddressContext';
import { getCurrentUser } from '@/lib/auth';

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  const userCartItems = currentUser ? await CartService.getCartItems(currentUser.userId) : [];
  const userAddress = currentUser ? await AddressService.getUserAddress(currentUser.userId) : null;

  return (
    <>
      <CartProvider initialCartItems={userCartItems}>
        <RentalOrderProvider>
          <UserAddressProvider userAddress={userAddress}>{children}</UserAddressProvider>
        </RentalOrderProvider>
      </CartProvider>
    </>
  );
}

import React from 'react';
import AddressService from '@/services/AddressService';
import { RentalOrderProvider } from '@/contexts/RentalOrderContext';
import { UserAddressProvider } from '@/contexts/UserAddressContext';
import { getCurrentUser } from '@/lib/auth';

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  const userAddress = currentUser ? await AddressService.getUserAddress(currentUser.userId) : null;

  return (
    <>
      <RentalOrderProvider>
        <UserAddressProvider userAddress={userAddress}>{children}</UserAddressProvider>
      </RentalOrderProvider>
    </>
  );
}

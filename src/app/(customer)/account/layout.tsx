import React from 'react';
import { RentalOrderProvider } from '@/contexts/RentalOrderContext';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RentalOrderProvider>{children}</RentalOrderProvider>
    </>
  );
}

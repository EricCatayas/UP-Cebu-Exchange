import React from 'react';
import { RentalOrderProvider } from '@/contexts/RentalOrderContext';

export default async function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RentalOrderProvider>{children}</RentalOrderProvider>
    </>
  );
}

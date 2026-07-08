import React from 'react';
import type { Metadata } from 'next';
import { RentalOrderProvider } from '@/contexts/RentalOrderContext';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RentalOrderProvider>{children}</RentalOrderProvider>
    </>
  );
}

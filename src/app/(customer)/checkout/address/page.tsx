'use client';
import React, { useState } from 'react';
import { useUserAddress } from '@/contexts/UserAddressContext';
import AddAddressForm from '@/components/form/Address/AddAddress';
import EditAddressForm from '@/components/form/Address/EditAddress';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { AddressDTO } from '@/models/Address';
import { eventApi } from '@/lib/api/event';

export default function CheckoutAddressPage() {
  const { isLoggedIn, isLoading } = useAuth();

  if (!isLoggedIn && !isLoading) {
    const router = useRouter();
    router.push('/login?redirect=/checkout/address');
    return null;
  }

  const { address, setAddress } = useUserAddress();
  const { sessionId } = useSession();

  const handleSetAddress = (newAddress: AddressDTO) => {
    setAddress(newAddress);
    logSetAddressEvent();
  };

  const logSetAddressEvent = () => {
    if (!sessionId) return;
    eventApi.setAddress();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout Address</h1>
      <div className="max-w-2xl bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          {address ? (
            <>
              <h2 className="text-xl font-semibold">Current Address</h2>
              <EditAddressForm address={address} handleSetAddress={handleSetAddress} />
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
              <AddAddressForm handleSetAddress={handleSetAddress} />
            </>
          )}
        </div>
      </div>
      <div className="mt-6">
        <a href="/checkout" className="text-blue-600 hover:underline">
          &larr; Back to Checkout
        </a>
      </div>
    </div>
  );
}

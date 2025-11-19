'use client';
import React, { useState } from 'react';
import { useUserAddress } from '@/contexts/UserAddressContext';
import AddAddress from '@/components/form/Address/AddAddress';
import EditAddress from '@/components/form/Address/EditAddress';

export default function CheckoutAddressPage() {
  const { address, setAddress } = useUserAddress();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout Address</h1>
      <div className="max-w-2xl bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          {address ? (
            <>
              <h2 className="text-xl font-semibold">Current Address</h2>
              <EditAddress address={address} handleSetAddress={setAddress} />
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
              <AddAddress handleSetAddress={setAddress} />
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

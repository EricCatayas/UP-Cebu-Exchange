'use client';
import React, { useState } from 'react';
import { useUserAddress } from '@/contexts/UserAddressContext';
import AddAddressForm from '@/components/form/Address/AddAddress';
import EditAddressForm from '@/components/form/Address/EditAddress';

export default function AddressProfileForm({ address: userAddress }: { address?: any }) {
  const [address, setAddress] = useState(userAddress);

  return (
    <>
      {address ? (
        <>
          <h2 className="text-xl font-semibold">Current Address</h2>
          <EditAddressForm address={address} handleSetAddress={setAddress} />
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
          <AddAddressForm handleSetAddress={setAddress} />
        </>
      )}
    </>
  );
}

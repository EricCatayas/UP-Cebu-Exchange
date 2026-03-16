'use client';

import React, { createContext, useContext, useState } from 'react';
import { AddressDTO } from '@/models/Address';

interface UserAddressContextType {
  address: AddressDTO | null;
  setAddress: (address: AddressDTO | null) => void;
  isHomeAddress: boolean;
  setIsHomeAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserAddressContext = createContext<UserAddressContextType | undefined>(undefined);

interface UserAddressProviderProps {
  children: React.ReactNode;
  userAddress?: AddressDTO | null;
}

export function UserAddressProvider({ children, userAddress = null }: UserAddressProviderProps) {
  const [address, setAddressState] = useState<AddressDTO | null>(userAddress);
  const [isHomeAddress, setIsHomeAddress] = useState<boolean>(!!userAddress);
  const setAddress = (address: AddressDTO | null) => {
    setAddressState(address);
  };

  return (
    <UserAddressContext.Provider value={{ address, setAddress, isHomeAddress, setIsHomeAddress }}>
      {children}
    </UserAddressContext.Provider>
  );
}

export function useUserAddress() {
  const ctx = useContext(UserAddressContext);
  if (!ctx) throw new Error('useUserAddress must be used within UserAddressProvider');
  return ctx;
}

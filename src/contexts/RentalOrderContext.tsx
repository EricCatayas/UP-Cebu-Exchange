'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ArtworkDTO } from '@/models/Artwork';
import { AddressDTO } from '@/models/Address';
import { DELIVERY_FEE, DELIVERY_METHOD, PAYMENT_METHOD } from '@/lib/constants';
import { getRentalFee } from '@/lib/artwork';

interface RentalOrderContextType {
  artworks: ArtworkDTO[];
  setArtworks: (artworks: ArtworkDTO[]) => void;
  address: AddressDTO | null;
  setAddress: (address: AddressDTO | null) => void;
  duration: number;
  setDuration: (duration: number) => void;
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  deliveryMethod: string;
  setDeliveryMethod: (method: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  contractSigned: boolean;
  setContractSigned: React.Dispatch<React.SetStateAction<boolean>>;
  subtotal: number;
  total: number;
}

const RentalOrderContext = createContext<RentalOrderContextType | undefined>(undefined);

export function RentalOrderProvider({ children }: { children: React.ReactNode }) {
  const [artworks, setArtworks] = useState<ArtworkDTO[]>([]);
  const [address, setAddress] = useState<AddressDTO | null>(null);
  const [duration, setDuration] = useState<number>(12);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deliveryMethod, setDeliveryMethod] = useState<string>(DELIVERY_METHOD.PICKUP);
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHOD.CASH);
  const [contractSigned, setContractSigned] = useState<boolean>(false);

  const endDate = useMemo(() => {
    if (!startDate) return '';
    const date = new Date(startDate);
    if (duration === 12) {
      // 364 days for 12 months
      date.setDate(date.getDate() + 364);
    } else {
      date.setMonth(date.getMonth() + duration);
    }
    return date.toISOString().split('T')[0];
  }, [startDate, duration]);

  useEffect(() => {
    if (contractSigned) {
      setContractSigned(false);
    }
  }, [duration, startDate, deliveryMethod, paymentMethod]);

  useEffect(() => {
    if (contractSigned) {
      setContractSigned(false);
    }
  }, [artworks.length]);

  const subtotal = useMemo(() => {
    return artworks.reduce((sum, artwork) => {
      return sum + getRentalFee(artwork, duration);
    }, 0);
  }, [artworks, duration]);

  const total = useMemo(() => {
    return subtotal + (deliveryMethod === DELIVERY_METHOD.DELIVERY ? DELIVERY_FEE : 0);
  }, [subtotal, deliveryMethod]);

  return (
    <RentalOrderContext.Provider
      value={{
        artworks,
        setArtworks,
        address,
        setAddress,
        duration,
        setDuration,
        startDate,
        endDate,
        setStartDate,
        deliveryMethod,
        setDeliveryMethod,
        paymentMethod,
        setPaymentMethod,
        contractSigned,
        setContractSigned,
        subtotal,
        total,
      }}
    >
      {children}
    </RentalOrderContext.Provider>
  );
}

export function useRentalOrder() {
  const ctx = useContext(RentalOrderContext);
  if (!ctx) throw new Error('useRentalOrder must be used within RentalOrderProvider');
  return ctx;
}

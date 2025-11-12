'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useCart } from '@/contexts/CartContext';
import { DELIVERY_FEE } from '@/lib/constants';

interface RentalOrderContextType {
  selectedDuration: number;
  setSelectedDuration: (duration: number) => void;
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

const RentalOrderContext = createContext<RentalOrderContextType | undefined>(
  undefined
);

export function RentalOrderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cartItems, selectedCartItemIds } = useCart();

  const [selectedDuration, setSelectedDuration] = useState<number>(12);
  const [startDate, setStartDate] = useState<string>('2025-10-09');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('Delivery');
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [contractSigned, setContractSigned] = useState<boolean>(false);

  const endDate = useMemo(() => {
    if (!startDate) return '';
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + selectedDuration);
    return date.toISOString().split('T')[0];
  }, [startDate, selectedDuration]);

  useEffect(() => {
    if (contractSigned) {
      setContractSigned(false);
    }
  }, [selectedDuration, startDate, deliveryMethod, paymentMethod]);

  useEffect(() => {
    if (contractSigned) {
      setContractSigned(false);
    }
  }, [selectedCartItemIds.size]);

  const subtotal = useMemo(() => {
    return cartItems
      .filter((item) => selectedCartItemIds.has(item.id))
      .reduce((sum, item) => {
        const plan = item.rentalPlans.find(
          (p) => p.durationMonths === selectedDuration
        );
        return sum + (plan?.rentalFee || 0);
      }, 0);
  }, [cartItems, selectedCartItemIds, selectedDuration]);

  const total = subtotal + (deliveryMethod === 'Delivery' ? DELIVERY_FEE : 0);

  return (
    <RentalOrderContext.Provider
      value={{
        selectedDuration,
        setSelectedDuration,
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
  if (!ctx)
    throw new Error('useRentalOrder must be used within RentalOrderProvider');
  return ctx;
}

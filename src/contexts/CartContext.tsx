'use client';

import React, { createContext, useContext, useState } from 'react';

interface RentalPlan {
  durationMonths: number;
  rentalFee: number;
}

interface Artwork {
  id: number;
  title: string;
  heightCm: number;
  widthCm: number;
}

export interface CartItem {
  id: number;
  artworkId: number;
  artwork: Artwork;
  imageUrl: string;
  rentalPlans: RentalPlan[];
}

interface CartContextType {
  cartItems: CartItem[];
  selectedCartItemIds: Set<number>;
  toggleCartItem: (id: number) => void;
  toggleAllCartItems: () => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Mock data (replace later with real source)
const initialMockCart: CartItem[] = [
  {
    id: 1,
    artworkId: 1,
    artwork: { id: 1, title: 'Painting 1', heightCm: 100, widthCm: 80 },
    imageUrl:
      'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-4x5.png',
    rentalPlans: [
      { durationMonths: 3, rentalFee: 200 },
      { durationMonths: 6, rentalFee: 250 },
      { durationMonths: 12, rentalFee: 300 },
    ],
  },
  {
    id: 2,
    artworkId: 2,
    artwork: { id: 2, title: 'Painting 2', heightCm: 60, widthCm: 120 },
    imageUrl:
      'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-2x1.png',
    rentalPlans: [
      { durationMonths: 3, rentalFee: 800 },
      { durationMonths: 6, rentalFee: 900 },
      { durationMonths: 12, rentalFee: 1000 },
    ],
  },
  {
    id: 3,
    artworkId: 3,
    artwork: { id: 3, title: 'Painting 3', heightCm: 50, widthCm: 50 },
    imageUrl:
      'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-1x1.png',
    rentalPlans: [
      { durationMonths: 3, rentalFee: 1500 },
      { durationMonths: 6, rentalFee: 1800 },
      { durationMonths: 12, rentalFee: 2000 },
    ],
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialMockCart);
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<Set<number>>(
    new Set([1, 2])
  );

  const toggleCartItem = (id: number) => {
    setSelectedCartItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllCartItems = () => {
    setSelectedCartItemIds((prev) =>
      prev.size === cartItems.length
        ? new Set()
        : new Set(cartItems.map((i) => i.id))
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedCartItemIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedCartItemIds,
        toggleCartItem,
        toggleAllCartItems,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

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
  setCartItems: (items: CartItem[]) => void;
  selectedCartItemIds: Set<number>;
  toggleCartItem: (id: number) => void;
  toggleAllCartItems: () => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
  initialCartItems?: CartItem[];
}

export function CartProvider({ children, initialCartItems = [] }: CartProviderProps) {
  const [cartItems, setItemsInCart] = useState<CartItem[]>(initialCartItems);
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<Set<number>>(new Set());

  const setCartItems = (items: CartItem[]) => {
    setItemsInCart(items);
  };

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
      prev.size === cartItems.length ? new Set() : new Set(cartItems.map((i) => i.id))
    );
  };

  const removeFromCart = (id: number) => {
    setItemsInCart((prev) => prev.filter((item) => item.id !== id));
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
        setCartItems,
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

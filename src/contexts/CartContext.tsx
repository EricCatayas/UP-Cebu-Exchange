'use client';

import React, { createContext, useContext, useState } from 'react';
import { ArtworkDTO } from '@/models/Artwork';
import { RentalPlanDTO } from '@/models/RentalPlan';
import { CartItemDTO } from '@/models/CartItem';

interface CartContextType {
  cartItems: CartItemDTO[];
  setCartItems: (items: CartItemDTO[]) => void;
  selectedCartItemIds: Set<number>;
  toggleCartItem: (id: number) => void;
  toggleAllCartItems: () => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
  initialCartItems?: CartItemDTO[];
}

export function CartProvider({ children, initialCartItems = [] }: CartProviderProps) {
  const [cartItems, setItemsInCart] = useState<CartItemDTO[]>(initialCartItems);
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<Set<number>>(new Set());

  const setCartItems = (items: CartItemDTO[]) => {
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
      prev.size === cartItems.length
        ? new Set()
        : new Set(cartItems.filter((item) => item.isAvailable).map((item) => item.id))
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

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ArtworkDTO } from '@/models/Artwork';
import { useAuth } from '@/contexts/AuthContext';
import { RentalPlanDTO } from '@/models/RentalPlan';
import { CART_STATUS, CartItemDTO } from '@/models/CartItem';
import { isAvailableForRental } from '@/lib/artwork';

interface CartContextType {
  cartItems: CartItemDTO[];
  addItemToCart: (artwork: ArtworkDTO) => Promise<void>;
  removeItemFromCart: (artworkId: number) => Promise<void>;
  setCartItems: (items: CartItemDTO[]) => void;
  selectedArtworkIds: Set<number>;
  toggleCartItem: (artworkId: number) => void;
  toggleAllCartItems: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
  initialCartItems?: CartItemDTO[];
}

export function CartProvider({ children }: CartProviderProps) {
  const { user } = useAuth();
  const [cartId, setCartId] = useState<number | null>(null);
  const [cartItems, setItemsInCart] = useState<CartItemDTO[]>([]);
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<Set<number>>(new Set());

  // load cart items
  useEffect(() => {
    if (!user) {
      setItemsInCart([]);
      setCartId(null);
      return;
    }

    const fetchCartItems = async () => {
      try {
        const { cartId, cartItems } = await cartApi.getItems();
        setCartId(cartId);
        setItemsInCart(cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    const syncCartWithServer = async () => {
      try {
        const artworkIdsInCart = cartItems.map((item) => item.artworkId);
        const { cartId, items } = await cartApi.addItems(artworkIdsInCart);
        setCartId(cartId);
        setItemsInCart(items);
      } catch (error) {
        console.error('Error syncing cart items:', error);
      }
    };

    if (hasUnsavedCartItems()) {
      console.log('Syncing cart items with server...', cartItems);
      syncCartWithServer();
    } else {
      console.log('Fetching cart items from server...');
      fetchCartItems();
    }
  }, [user]);

  const hasUnsavedCartItems = () => {
    return cartItems.some((item) => item.id === undefined);
  };

  const setCartItems = (items: CartItemDTO[]) => {
    setItemsInCart(items);
  };

  const addItemToCart = async (artwork: ArtworkDTO) => {
    try {
      const artworkId = artwork.id;
      if (user) {
        const { cartId, items } = await cartApi.addItem(artworkId);
        setCartId(cartId);
        setItemsInCart(items);
      } else {
        setItemsInCart((prev) => [
          ...prev,
          { artworkId, artwork, isAvailable: isAvailableForRental(artwork) } as CartItemDTO,
        ]);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  };

  const removeItemFromCart = async (artworkId: number) => {
    try {
      if (user) {
        const { cartId, items } = await cartApi.removeItem(artworkId);
        setCartId(cartId);
        setItemsInCart(items);
      } else {
        setItemsInCart((prev) => prev.filter((item) => item.artworkId !== artworkId));
      }
      setSelectedArtworkIds((prev) => {
        const next = new Set(prev);
        if (next.has(artworkId)) next.delete(artworkId);
        return next;
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  };

  const toggleCartItem = (artworkId: number) => {
    setSelectedArtworkIds((prev) => {
      const next = new Set(prev);
      if (next.has(artworkId)) next.delete(artworkId);
      else next.add(artworkId);
      return next;
    });
  };

  const toggleAllCartItems = () => {
    setSelectedArtworkIds((prev) =>
      prev.size === cartItems.length
        ? new Set()
        : new Set(cartItems.filter((item) => item.isAvailable).map((item) => item.artworkId))
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addItemToCart,
        removeItemFromCart,
        selectedArtworkIds,
        toggleCartItem,
        toggleAllCartItems,
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

const cartApi = {
  addItems: async (artworkIds: number[]) => {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artworkIds }),
    });

    if (response.status === 403) {
      return { cartId: null, items: [] };
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to add items to cart');
    }

    const { cartId, items } = await response.json();
    return { cartId, items };
  },

  addItem: async (artworkId: number) => {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artworkIds: [artworkId] }),
    });

    if (response.status === 403) {
      return { cartId: null, items: [] };
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to add item to cart');
    }

    const { cartId, items } = await response.json();
    return { cartId, items };
  },

  removeItem: async (artworkId: number) => {
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artworkId }),
    });

    if (response.status === 403) {
      return { cartId: null, items: [] };
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to remove item from cart');
    }

    const { cartId, items } = await response.json();
    return { cartId, items };
  },

  getItems: async () => {
    const response = await fetch('/api/cart');
    if (response.status === 403) {
      return { cartId: null, cartItems: [] };
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to fetch cart items');
    }
    const { cartId, items: cartItems } = await response.json();
    return { cartId, cartItems };
  },
};

'use client';
import HeartIcon from '../HeartIcon/HeartIcon';
import CartIcon from '../CartIcon/CartIcon';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { eventApi } from '@/lib/api/event';
import { wishlistApi } from '@/lib/api/wishlist';
import { ArtworkDTO } from '@/models/Artwork';

export default function ToggleCartWishlist({ artwork }: { artwork: ArtworkDTO }) {
  const { user } = useAuth();
  const { addItemToCart, removeItemFromCart } = useCart();

  const [inCart, setInCart] = useState(artwork.isInCart);
  const [inWishlist, setInWishlist] = useState(artwork.isInWishlist);

  const handleToggleCart = async () => {
    try {
      if (inCart) {
        await removeItemFromCart(artwork.id);
        setInCart(false);
      } else {
        await addItemToCart(artwork);
        setInCart(true);
        alert('Artwork added to cart');
        eventApi.addToCart(artwork.id);
      }
    } catch (error) {
      alert('Error toggling cart item:', error);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (!user) {
        alert('You need to be signed in to add item to wishlist');
        return;
      }
      if (inWishlist) {
        await wishlistApi.removeItem(artwork.id);
        setInWishlist(false);
      } else {
        await wishlistApi.addItem(artwork.id);
        setInWishlist(true);
        alert('Artwork added to wishlist');
        eventApi.addToWishlist(artwork.id);
      }
    } catch (error) {
      alert('Error toggling wishlist item:', error.message);
    }
  };

  return (
    <div className="flex gap-2">
      <button onClick={handleToggleWishlist} title="Add to wishlist" type="button">
        <HeartIcon filled={inWishlist} />
      </button>
      <button onClick={handleToggleCart} title="Add to cart" type="button">
        <CartIcon filled={inCart} />
      </button>
    </div>
  );
}

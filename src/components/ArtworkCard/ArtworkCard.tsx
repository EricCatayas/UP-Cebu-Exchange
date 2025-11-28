'use client';
import HeartIcon from '../HeartIcon/HeartIcon';
import CartIcon from '../CartIcon/CartIcon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDimension, getImageUrl } from '@/lib/artwork';
import { cartApi } from '@/lib/api/cart';
import { wishlistApi } from '@/lib/api/wishlist';
import './ArtworkCard.css';

export default function ArtworkCard({ artwork, displayInfo = true }: { artwork: any; displayInfo?: boolean }) {
  if (!artwork) return null;

  const { user } = useAuth();

  const primaryImageUrl = getImageUrl(artwork);
  const lowestPlan = artwork.rentalPlans ? [...artwork.rentalPlans].sort((a, b) => a.price - b.price)[0] : null;

  const [inCart, setInCart] = useState(artwork.isInCart);
  const [inWishlist, setInWishlist] = useState(artwork.isInWishlist);

  const router = useRouter();

  const NavigateToArtwork = () => router.push(`/artworks/${artwork.id}`);
  const NavigateToArtist = () => router.push(`/artists/${artwork.artist?.id}`);

  const handleToggleCart = async () => {
    try {
      if (!user) {
        alert('You need to be signed in to add item to cart');
        return;
      }
      if (inCart) {
        await cartApi.removeItem(artwork.id);
        setInCart(false);
      } else {
        await cartApi.addItem(artwork.id);
        setInCart(true);
      }
    } catch (error) {
      console.error('Error toggling cart item:', error);
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
      }
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
    }
  };

  return (
    <div className={`artwork-card status-${artwork.status}`}>
      {artwork.status === 'rented' && <div className="ribbon">Rented</div>}
      <button type="button" className="image-wrapper" onClick={NavigateToArtwork} aria-label={`View ${artwork.title}`}>
        <img src={primaryImageUrl} alt={artwork.title} loading="lazy" />
      </button>
      {displayInfo && (
        <div className="info-row">
          <div className="left">
            <button type="button" onClick={NavigateToArtwork} className="title text-left cursor-pointer">
              {artwork.title}
            </button>
            {artwork.artist && (
              <button type="button" onClick={NavigateToArtist} className="artist text-left cursor-pointer">
                {artwork.artist?.name}
              </button>
            )}
            {lowestPlan && <div className="price">as low as: ₱ {lowestPlan.price.toLocaleString()}</div>}
          </div>
          <div className="right">
            <div className="dimension">{getDimension(artwork)}</div>
            <div className="flex gap-2">
              <button onClick={handleToggleWishlist} title="Add to wishlist" type="button">
                <HeartIcon filled={inWishlist} />
              </button>
              <button onClick={handleToggleCart} title="Add to cart" type="button">
                <CartIcon filled={inCart} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

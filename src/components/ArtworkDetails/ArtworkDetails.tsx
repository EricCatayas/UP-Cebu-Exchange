'use client';
import Link from 'next/link';
import HeartIcon from '../HeartIcon/HeartIcon';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { ArtworkDTO } from '@/models/Artwork';
import { getDimension } from '@/lib/artwork';
import { artworkApi } from '@/lib/api/artwork';
import { cartApi } from '@/lib/api/cart';
import { eventApi } from '@/lib/api/event';
import { wishlistApi } from '@/lib/api/wishlist';
import { hasOngoingRental as hasOngoingRentalOrder } from '@/lib/artwork';
import { fmtDate } from '@/lib/formatter';

function ArtworkDetails({
  artwork,
  viewCount,
  wishlistCount,
}: {
  artwork: ArtworkDTO;
  viewCount: number;
  wishlistCount: number;
}) {
  const router = useRouter();

  const artist = artwork.artist;
  const { user } = useAuth();
  const { sessionId } = useSession();
  const [inCart, setInCart] = useState(artwork.isInCart);
  const [inWishlist, setInWishlist] = useState(artwork.isInWishlist);
  const [hasOngoingRental, setHasOngoingRental] = useState(hasOngoingRentalOrder(artwork));
  const [availableDate, setAvailableDate] = useState<string | null>(null);

  const handleNavigateToArtist = () => router.push(`/artists/${artist.id}`);

  const handleAddToCart = async () => {
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
        alert('Artwork added to cart');
        eventApi.addToCart(artwork.id);
      }
    } catch (error) {
      alert('Error toggling cart item:', error.message);
    }
  };

  const handleAddToWishlist = async () => {
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

  useEffect(() => {
    const fetchAvailableDate = async () => {
      const { availableDate } = await artworkApi.availableDate(artwork.id);
      setAvailableDate(availableDate);
    };

    if (hasOngoingRental) {
      fetchAvailableDate();
    }
  }, [artwork]);

  useEffect(() => {
    const logViewArtworkEvent = () => {
      if (!sessionId) return;
      eventApi.viewArtwork(artwork.id);
    };

    logViewArtworkEvent();
  }, [sessionId, artwork.id]);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm mb-4 text-gray-600">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {' / '}
        <Link href="/artworks" className="hover:underline">
          All Artworks
        </Link>
      </nav>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-2">{artwork.title}</h1>

      {/* Artist */}
      {artist && (
        <p className="text-lg mb-4">
          By:{' '}
          <span className="font-medium cursor-pointer" onClick={handleNavigateToArtist}>
            {artist.name}
          </span>
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm text-gray-600 italic">#{artwork.style?.name}</span>
        {artwork.tags?.map((tag, index) => (
          <span key={index} className="text-sm text-gray-600 italic">
            #{tag.name}
          </span>
        ))}
      </div>

      {/* Rental Plans */}
      {artwork.rentalPlans?.length > 0 && (
        <div className="mb-6">
          <label htmlFor="rentalPlan" className="text-sm text-gray-600 mb-1 block">
            Choose a rental plan:
          </label>
          <select id="rentalPlan" name="rentalPlan" className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            {artwork.rentalPlans.map((plan) => (
              <option key={plan.durationMonths} value={plan.durationMonths}>
                {plan.durationMonths} months - ₱{plan.price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex">
          <span className="font-semibold w-24">Medium:</span>
          <span className="text-gray-700">{artwork.medium}</span>
        </div>
        <div className="flex">
          <span className="font-semibold w-24">Size:</span>
          <span className="text-gray-700">{getDimension(artwork)}</span>
        </div>
        <div className="flex">
          <span className="font-semibold w-24">Year:</span>
          <span className="text-gray-700">{new Date(artwork.createdAt).getFullYear()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleAddToCart}
          disabled={inCart}
          className="flex-1 bg-secondary text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.41A2 2 0 0 0 10 20h10v-2H10l1.1-2h7.45a2 2 0 0 0 1.79-1.11L22 9H6.21l-.94-2H7V4Zm3 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
          </svg>
          {inCart ? 'Added In Cart' : 'Add to Cart'}
        </button>
        <button
          onClick={handleAddToWishlist}
          disabled={inWishlist}
          className="flex-1 bg-tertiary text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </button>
      </div>

      {/* Stats */}
      <div className="space-y-3 text-gray-600">
        <div className="flex items-center gap-3">
          <HeartIcon filled={true} />
          {wishlistCount > 0 ? (
            <span>{wishlistCount.toLocaleString()} people have this on their Wishlist</span>
          ) : (
            <span>Be the first to add this to your Wishlist</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <span>{viewCount.toLocaleString()} have viewed this art piece</span>
        </div>
        {hasOngoingRental && availableDate && (
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm0-13H5V5h14v1z" />
            </svg>
            <span>Currently rented. Available from: {fmtDate(availableDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtworkDetails;

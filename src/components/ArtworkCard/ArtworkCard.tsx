'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDimension, getImageUrl } from '@/lib/artwork';
import { ARTWORK_STATUS } from '@/lib/constants';
import './ArtworkCard.css';
import ToggleCartWishlist from './ToggleCartWishlist';

export default function ArtworkCard({
  artwork,
  displayInfo = true,
  displayCartWishlist = true,
}: {
  artwork: any;
  displayInfo?: boolean;
  displayCartWishlist?: boolean;
}) {
  if (!artwork) return null;

  const router = useRouter();

  const primaryImageUrl = getImageUrl(artwork);
  const lowestPlan = artwork.rentalPlans ? [...artwork.rentalPlans].sort((a, b) => a.price - b.price)[0] : null;

  const NavigateToArtwork = () => router.push(`/artworks/${artwork.id}`);
  const NavigateToArtist = () => router.push(`/artists/${artwork.artist?.id}`);

  return (
    <div className={`artwork-card status-${artwork.status}`}>
      <button type="button" className="image-wrapper" onClick={NavigateToArtwork} aria-label={`View ${artwork.title}`}>
        {artwork.status === ARTWORK_STATUS.RESERVED && <div className="badge badge-reserved">Reserved</div>}
        {artwork.status === ARTWORK_STATUS.RENTED && <div className="badge badge-rented">Rented</div>}
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
            {displayCartWishlist && <ToggleCartWishlist artwork={artwork} />}
          </div>
        </div>
      )}
    </div>
  );
}

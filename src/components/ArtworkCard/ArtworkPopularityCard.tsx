'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getImageUrl } from '@/lib/artwork';
import { ArtworkWithScore } from '@/models/Artwork';
import { PopularityScore } from '@/types/analytics';
import './ArtworkCard.css';

export default function ArtworkPopularityCard({
  artwork,
  scores,
  rank,
}: {
  artwork: ArtworkWithScore;
  scores: PopularityScore;
  rank: number;
}) {
  if (!artwork) return null;

  const { user } = useAuth();
  const router = useRouter();

  const imageUrl = getImageUrl(artwork) || '/placeholder.png';

  return (
    <button
      key={artwork.id}
      type="button"
      onClick={() => router.push(`/artworks/${artwork.id}`)}
      className="min-w-[260px] max-w-[260px] rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow text-left"
      aria-label={`View ${artwork.title || 'Artwork'}`}
    >
      <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
        <img src={imageUrl} alt={artwork.title || 'Artwork'} className="h-full w-full object-cover" />
        <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">#{rank}</div>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-sm font-semibold text-gray-900 line-clamp-2">{artwork.title || 'Untitled'}</div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex flex-col">
            <span className="text-gray-400">Views</span>
            <span className="font-medium text-gray-900">{scores.viewCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Wishlist</span>
            <span className="font-medium text-gray-900">{scores.wishlistCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Cart</span>
            <span className="font-medium text-gray-900">{scores.cartCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Orders</span>
            <span className="font-medium text-gray-900">{scores.orderCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Rented</span>
            <span className="font-medium text-gray-900">{scores.rentedCount}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

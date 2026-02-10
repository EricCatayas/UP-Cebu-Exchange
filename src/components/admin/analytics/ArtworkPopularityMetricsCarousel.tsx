'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/artwork';
import { PopularityScore } from '@/types/analytics';

export default function ArtworkPopularityMetricsCarousel({
  artworks,
  popularityScores,
}: {
  artworks: {
    popularityScore: number;
    id: number;
    title?: string;
    artistId?: number;
    description?: string;
    medium: string;
    styleId?: number;
    heightCm?: number;
    widthCm?: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  popularityScores: { [artworkId: number]: PopularityScore };
}) {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const scrollAmount = carouselRef.current.clientWidth;
    const newScrollLeft =
      direction === 'left'
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });

    setTimeout(checkScrollability, 300);
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [artworks]);

  if (!artworks || artworks.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 shadow p-2 hover:bg-white"
          onClick={() => scroll('left')}
          aria-label="Previous artworks"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-hidden scroll-smooth px-2 py-2"
        onScroll={checkScrollability}
      >
        {artworks.map((artwork, index) => {
          const scores = popularityScores[artwork.id];
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
                <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                  #{index + 1}
                </div>
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
        })}
      </div>

      {canScrollRight && (
        <button
          type="button"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 shadow p-2 hover:bg-white"
          onClick={() => scroll('right')}
          aria-label="Next artworks"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  );
}

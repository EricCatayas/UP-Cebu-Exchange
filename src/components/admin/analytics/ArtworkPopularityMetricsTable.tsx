'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getImageUrl } from '@/lib/artwork';
import { PopularityScore } from '@/types/analytics';

export default function ArtworkPopularityMetricsTable({
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
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [selectedStyleIds, setSelectedStyleIds] = useState<number[]>(
    searchParams.get('styles')?.split(',').map(Number).filter(Boolean) || []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectSortBy = (value: string) => {
    setSortBy(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Artwork Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              View Count
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Wishlist Count
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cart Count
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Count
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rented Count
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {artworks.map((artwork, index) => {
            const scores = popularityScores[artwork.id];
            return (
              <tr key={artwork.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative h-16 w-16">
                    <img
                      src={getImageUrl(artwork) || '/placeholder.png'}
                      alt={artwork.title || 'Artwork'}
                      className="object-cover rounded h-16 w-16"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{artwork.title || 'Untitled'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scores.viewCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scores.wishlistCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scores.cartCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scores.orderCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scores.rentedCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

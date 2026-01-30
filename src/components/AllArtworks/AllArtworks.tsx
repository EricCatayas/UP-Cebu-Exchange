'use client';
import React, { useEffect, useState } from 'react';
import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import ArtworksFilterBar from '@/components/ArtworksFilterBar/ArtworksFilterBar';
import LineBreak from '@/components/ui/LineBreak';
import PageHeader from '@/components/PageHeader/PageHeader';
import Pagination from '@/components/Pagination/Pagination';
import { useSession } from '@/contexts/SessionContext';
import { eventApi } from '@/lib/api/event';
import { ArtworkDTO } from '@/models/Artwork';

export default function AllArtworks({
  artworks,
  artworkMediums,
  artworkStyles,
  currentpage,
  totalPages,
  nextPage,
  previousPage,
}: {
  artworks: ArtworkDTO[];
  artworkMediums: string[];
  artworkStyles: { id: number; name: string }[];
  currentpage: number;
  totalPages: number;
  nextPage?: number;
  previousPage?: number;
}) {
  const { sessionId } = useSession();

  useEffect(() => {
    const logBrowseEvent = () => {
      if (!sessionId) return;
      eventApi.browseArtworks();
    };

    logBrowseEvent();
  }, [sessionId]);

  return (
    <>
      <PageHeader title="All Artworks" />

      <div className="container mx-auto px-4 pb-8">
        <ArtworksFilterBar mediums={artworkMediums} styles={artworkStyles} />
        <LineBreak />

        {/* Artwork Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mt-6 space-y-6">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="break-inside-avoid mb-6">
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>

        {/* No results message */}
        {artworks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No artworks found matching your filters.</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination page={currentpage} totalPages={totalPages} nextPage={nextPage} previousPage={previousPage} />
      </div>
    </>
  );
}

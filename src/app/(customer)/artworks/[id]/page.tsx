import React, { Suspense } from 'react';
import ArtworkDetails from '@/components/ArtworkDetails/ArtworkDetails';
import ArtworksFromArtist from '@/components/ArtworkDetails/ArtworksFromArtist';
import ArtworkGallery from '@/components/ArtworkGallery/ArtworkGallery';
import ArtworkService from '@/services/ArtworkService';
import SimilarArtworks from '@/components/ArtworkDetails/SimilarArtworks';
import HeroBackground from '@/components/HeroBackground/HeroBackground';
import ProductDemandService from '@/services/ProductDemandService';
import { getCurrentUser } from '@/lib/auth';

async function ArtworkDetailsPage({ params }: { params: { id: string } }) {
  const id = parseInt((await params).id);

  const currentUser = await getCurrentUser();
  const artworkService = new ArtworkService(currentUser?.userId);
  const artwork = await artworkService.getArtworkById(id);

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Artwork not found</p>
      </div>
    );
  }

  const [viewCount, wishlistCount] = await Promise.all([
    ProductDemandService.getArtworkViewCount(id),
    ProductDemandService.getArtworkWishlistCount(id),
  ]);

  return (
    <div>
      <HeroBackground>
        <div className="container mx-auto px-4 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-8">
            {/* Left Column - Image Gallery */}
            <ArtworkGallery artwork={artwork} />
            {/* Right Column - Details */}
            <ArtworkDetails artwork={artwork} viewCount={viewCount} wishlistCount={wishlistCount} />
          </div>
        </div>
      </HeroBackground>
      {/* Description Section */}
      <div className="border-t pt-6">
        <details className="group" open>
          <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-lg mb-4">
            <span>Description</span>
            <svg
              className="w-5 h-5 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="mt-4 text-gray-700 leading-relaxed">
            <p>{artwork.description || 'No description available.'}</p>
          </div>
        </details>
      </div>

      {/* More from the Artist */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">More from the Artist</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <ArtworksFromArtist artistId={artwork.artistId} excludeArtworkId={artwork.id} />
        </Suspense>
      </div>

      {/* Similar Artworks */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Artworks</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <SimilarArtworks artworkId={artwork.id} />
        </Suspense>
      </div>
    </div>
  );
}

export default ArtworkDetailsPage;

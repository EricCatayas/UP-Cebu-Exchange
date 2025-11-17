import React from 'react';
import ArtworkCarousel from '@/components/ArtworkCarousel/ArtworkCarousel';
import ArtworkDetails from '@/components/ArtworkDetails/ArtworkDetails';
import ArtworkGallery from '@/components/ArtworkGallery/ArtworkGallery';
import ArtworkGrid from '@/components/ArtworkGrid/ArtworkGrid';
import ArtworkService from '@/services/ArtworkService';
import CartService from '@/services/CartService';
import WishlistService from '@/services/WishlistService';
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

  const artworksFromArtist = await artworkService.getArtworksFromArtist(artwork?.artistId || 0);
  const index = artworksFromArtist.findIndex((a) => a.id === artwork.id);
  if (index !== -1) {
    artworksFromArtist.splice(index, 1);
  }

  const similarArtworks = await artworkService.getSimilarArtworks(artwork.id);

  console.log('Artwork Details:', artwork);
  console.log('Artworks from Artist:', artworksFromArtist);

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Artwork not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-8">
        {/* Left Column - Image Gallery */}
        <ArtworkGallery artwork={artwork} />
        {/* Right Column - Details */}
        <ArtworkDetails artwork={artwork} />
      </div>

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
        {artworksFromArtist.length > 0 ? (
          <ArtworkCarousel artworks={artworksFromArtist} />
        ) : (
          <p className="text-gray-600">No other artworks from this artist.</p>
        )}
      </div>

      {/* Similar Artworks */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Artworks</h2>
        {similarArtworks.length > 0 ? (
          <ArtworkGrid artworks={similarArtworks} />
        ) : (
          <p className="text-gray-600">No similar artworks found.</p>
        )}
      </div>
    </div>
  );
}

export default ArtworkDetailsPage;

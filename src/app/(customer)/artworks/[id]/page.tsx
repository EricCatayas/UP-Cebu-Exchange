import React from 'react';
import ArtworkCarousel from '@/components/ArtworkCarousel/ArtworkCarousel';
import ArtworkGallery from '@/components/ArtworkGallery/ArtworkGallery';
import ArtworkGrid from '@/components/ArtworkGrid/ArtworkGrid';
import ArtistLink from '@/components/ArtistLink/ArtistLink';
import { sample_artworks } from '@/models/sample-artworks';
import Link from 'next/link';

async function ArtworkDetails({ params }: { params: { id: string } }) {
  const id = (await params).id;
  // TODO: Replace with real data
  const artwork = sample_artworks.find((art) => art.id === parseInt(id));
  const artworksFromArtist = sample_artworks.slice(0, 6);
  const similarArtworks = sample_artworks.slice(6, 12);

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Artwork not found</p>
      </div>
    );
  }

  const dimension = `${artwork.heightCm}cm × ${artwork.widthCm}cm`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Image Gallery */}
        <ArtworkGallery artwork={artwork} />
        {/* Right Column - Details */}
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
          {artwork.artist && (
            <p className="text-lg mb-4">
              By: <ArtistLink artist={artwork.artist} />
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {artwork.tags?.map((tag, index) => (
              <span key={index} className="text-sm text-gray-600 italic">
                #{tag}
              </span>
            ))}
          </div>

          {/* Rental Plans */}
          {artwork.rentalPlans?.length > 0 && (
            <div className="mb-6">
              <label
                htmlFor="rentalPlan"
                className="text-sm text-gray-600 mb-1 block"
              >
                Choose a rental plan:
              </label>
              <select
                id="rentalPlan"
                name="rentalPlan"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {artwork.rentalPlans.map((plan) => (
                  <option key={plan.durationMonths} value={plan.durationMonths}>
                    {plan.durationMonths} months - ₱
                    {plan.rentalFee.toLocaleString()}
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
              <span className="text-gray-700">{dimension}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24">Year:</span>
              <span className="text-gray-700">
                {new Date(artwork.createdAt).getFullYear()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.41A2 2 0 0 0 10 20h10v-2H10l1.1-2h7.45a2 2 0 0 0 1.79-1.11L22 9H6.21l-.94-2H7V4Zm3 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
              </svg>
              Add to Cart
            </button>
            <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Add to Wishlist
            </button>
          </div>

          {/* Stats */}
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="red">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>125 people have this on their Wishlist</span>
            </div>
            <div className="flex items-center gap-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <span>790 have viewed this art piece</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="border-t pt-6">
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-lg mb-4">
            <span>Description</span>
            <svg
              className="w-5 h-5 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
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
        <ArtworkCarousel artworks={artworksFromArtist} />
      </div>

      {/* Similar Artworks */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Artworks</h2>
        <ArtworkGrid artworks={similarArtworks} />
      </div>
    </div>
  );
}

export default ArtworkDetails;

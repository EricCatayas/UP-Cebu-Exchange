import React from 'react';
import ArtworkGrid from '@/components/ArtworkGrid/ArtworkGrid';
import ArtworkService from '@/services/ArtworkService';
import PageHeader from '@/components/PageHeader/PageHeader';
import { getCurrentUser } from '@/lib/auth';

async function Artworks() {
  const currentUser = await getCurrentUser();
  const artworkService = new ArtworkService(currentUser?.userId);
  const userWishlistArtworks = await artworkService.getUserWishlistArtworks();

  return (
    <>
      <PageHeader title="My Wishlist" />
      <div className="container mx-auto px-4 py-8">
        {userWishlistArtworks.length > 0 ? (
          <ArtworkGrid artworks={userWishlistArtworks} />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Browse our gallery and add artworks to your wishlist.</p>
            <a
              href="/artworks"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Explore Gallery
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default Artworks;

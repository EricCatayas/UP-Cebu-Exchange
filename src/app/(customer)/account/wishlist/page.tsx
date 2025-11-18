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
        <ArtworkGrid artworks={userWishlistArtworks} />
      </div>
    </>
  );
}

export default Artworks;

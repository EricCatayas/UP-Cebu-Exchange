import React from 'react';
import ArtworkGrid from '@/components/ArtworkGrid/ArtworkGrid';
import ArtworkService from '@/services/ArtworkService';
import PageHeader from '@/components/PageHeader/PageHeader';
import { getCurrentUser } from '@/lib/auth';

async function Artworks() {
  // TODO: Pagination, Filtering, Sorting
  const currentUser = await getCurrentUser();
  const artworkService = new ArtworkService(currentUser?.userId);
  const allArtworks = await artworkService.getAllArtworks();

  return (
    <>
      <PageHeader title="All Artworks" />

      <div className="container mx-auto px-4 py-8">
        <input type="text" placeholder="Search by artwork, artist, or style" />
        <button>FILTER</button>
        <label>SORT BY:</label>
        <button>Popular</button>
        <button>Latest</button>
        <br />
        {/* Line break here */}
        <ArtworkGrid artworks={allArtworks} />
        {/* Todo: Pagination */}
      </div>
    </>
  );
}

export default Artworks;

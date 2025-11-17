// All Artworks
import React from 'react';
import ArtworkGrid from '@/components/ArtworkGrid/ArtworkGrid';
import ArtworkService from '@/app/services/ArtworkService';
async function Artworks() {
  // TODO: Pagination, Filtering, Sorting
  const allArtworks = await ArtworkService.getAllArtworks();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Artworks</h1>

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
  );
}

export default Artworks;

// All Artworks
import React from "react";
import ArtworkCard from "@/components/ArtworkCard/ArtworkCard";
import { sample_artworks } from "@/models/sample-artworks";

function Artworks() {
  const allArtworks = sample_artworks;

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
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mt-6 space-y-6">
        {allArtworks.map((artwork) => (
          <div key={artwork.id} className="break-inside-avoid mb-6">
            <ArtworkCard artwork={artwork} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Artworks;

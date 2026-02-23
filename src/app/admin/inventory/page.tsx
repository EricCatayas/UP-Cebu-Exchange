import Link from 'next/link';
import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import ArtworksTable from '@/components/admin/ArtworksTable';
import ArtworkService from '@/services/ArtworkService';
import { ARTWORK_STATUS } from '@/lib/constants';

async function Inventory() {
  const artworkService = new ArtworkService();

  const allArtworks = await artworkService.getAllArtworks();

  let availableCount = 0;
  let rentedCount = 0;
  let unavailableCount = 0;

  allArtworks.forEach((artwork) => {
    if (artwork.status === ARTWORK_STATUS.AVAILABLE) {
      availableCount++;
    } else if (artwork.status === ARTWORK_STATUS.RENTED) {
      rentedCount++;
    } else if (artwork.status === ARTWORK_STATUS.UNAVAILABLE) {
      unavailableCount++;
    }
  });

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/inventory/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add New Artwork
          </Link>
          <Link
            href="/admin/artists"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            View Artists
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {/* Inventory */}
        <section className="flex items-start gap-6">
          <div className="w-28 text-gray-700 font-medium pt-2">Inventory</div>
          <div className="flex flex-wrap gap-6">
            <AnalyticsCard header="Available" value={availableCount} />
            <AnalyticsCard header="Rented" value={rentedCount} />
          </div>
        </section>

        {/* Artworks Table */}
        <section>
          <ArtworksTable artworks={allArtworks} />
        </section>
      </div>
    </div>
  );
}

export default Inventory;

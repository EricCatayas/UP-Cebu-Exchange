import Link from 'next/link';
import AnalyticsCard from '@/components/AnalyticsCard/AnalyticsCard';
import ArtistService from '@/services/ArtistService';
import ArtistsTable from '@/components/admin/ArtistsTable';

async function Artists() {
  const artists = await ArtistService.getAllArtists();

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Artists</h1>
        <Link
          href="/admin/artists/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Create New Artist
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        {/* Artists Table */}
        <ArtistsTable artists={artists} />
      </div>
    </div>
  );
}

export default Artists;

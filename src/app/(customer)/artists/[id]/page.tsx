import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import PageHeader from '@/components/PageHeader/PageHeader';
import ArtworkService from '@/services/ArtworkService';

async function ArtistArtworks({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const artworkService = new ArtworkService();
  const artworks = await artworkService.getArtworksFromArtist(id);
  const artist = artworks.length > 0 ? artworks[0].artist : null;

  if (!artist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Artist not found</p>
      </div>
    );
  }

  // Todo: Display name, bio, and artworks by this artist
  return (
    <>
      <PageHeader title={`Artworks by ${artist.name}`} />

      <div className="container mx-auto px-4 pb-8">
        {/* Artwork Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mt-6 space-y-6">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="break-inside-avoid mb-6">
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>

        {/* No results message */}
        {artworks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No artworks found by this artist.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ArtistArtworks;

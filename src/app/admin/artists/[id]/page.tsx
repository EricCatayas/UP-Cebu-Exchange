import Link from 'next/link';
import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import ArtistEditForm from '@/components/form/Artist/ArtistEditForm';
import NotFound from '@/components/errors/NotFound';
import PrevPageLink from '@/components/ui/PrevPageLink';
import ArtistService from '@/services/ArtistService';

async function ArtistDetails({ params }: { params: Promise<{ id: string }>}) {
  const id = parseInt((await params).id);

  const artist = await ArtistService.getArtistById(id);

  if (!artist) {
    return <NotFound header="Artist Not Found" linkText="Back to Artists" linkHref="/admin/artists" />;
  }

  const artworks = artist.artworks || [];

  return (
    <div className="px-8 py-6">
      <div className="mb-6">
        <PrevPageLink href="/admin/artists" label="Back to Artists" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <ArtistEditForm artist={artist} />
        </div>

        {/* Artworks Section */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold mb-6">Artworks</h3>
          {artworks.length > 0 ? (
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {artworks.map((artwork) => (
                <div key={artwork.id} className="break-inside-avoid mb-6">
                  <ArtworkCard artwork={artwork} displayCartWishlist={false} />
                  <Link
                    href={`/admin/inventory/${artwork.id}`}
                    className="text-sm px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors font-medium"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/inventory/${artwork.id}/edit`}
                    className="ml-2 text-sm px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors font-medium"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No artworks found by this artist.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtistDetails;

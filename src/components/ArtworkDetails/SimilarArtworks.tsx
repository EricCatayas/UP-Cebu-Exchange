import ArtworkGrid from '@/components/ArtworkGrid/ArtworkGrid';
import ArtworkService from '@/services/ArtworkService';

export default async function SimilarArtworks({ artworkId }: { artworkId: number }) {
  const artworkService = new ArtworkService();
  const similarArtworks = await artworkService.getSimilarArtworks(artworkId, { limit: 9 });

  return (
    <>
      {similarArtworks.length > 0 ? (
        <ArtworkGrid artworks={similarArtworks} />
      ) : (
        <p className="text-gray-600">No similar artworks found.</p>
      )}
    </>
  );
}

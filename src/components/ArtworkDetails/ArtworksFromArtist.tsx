import ArtworkCarousel from '@/components/ArtworkCarousel/ArtworkCarousel';
import ArtworkService from '@/services/ArtworkService';

export default async function ArtworksFromArtist({
  artistId,
  excludeArtworkId,
}: {
  artistId?: number;
  excludeArtworkId: number;
}) {
  const artworkService = new ArtworkService();

  const artworksFromArtist = await artworkService.getArtworksFromArtist(artistId);
  const index = artworksFromArtist.findIndex((a) => a.id === excludeArtworkId);
  if (index !== -1) {
    artworksFromArtist.splice(index, 1);
  }

  return (
    <>
      {artworksFromArtist.length > 0 ? (
        <ArtworkCarousel artworks={artworksFromArtist} />
      ) : (
        <p className="text-gray-600">No other artworks from this artist.</p>
      )}
    </>
  );
}

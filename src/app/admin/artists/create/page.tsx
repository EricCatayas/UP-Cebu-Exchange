import Link from 'next/link';
import ArtworkRepository from '@/repositories/ArtworkRepository';
import ArtistCreateForm from '@/components/form/Artist/ArtistCreateForm';
import PrevPageLink from '@/components/ui/PrevPageLink';

async function CreateArtist() {
  const artworksWithoutArtist = await ArtworkRepository.findAll({ where: { artistId: null } });

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <PrevPageLink href="/admin/artists" label="Back to Artists" />
      </div>

      <section className="container">
        <ArtistCreateForm artworks={artworksWithoutArtist} />
      </section>
    </div>
  );
}

export default CreateArtist;

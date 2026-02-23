import Link from 'next/link';
import ArtworkRepository from '@/repositories/ArtworkRepository';
import ArtistCreateForm from '@/components/form/Artist/ArtistCreateForm';

async function CreateArtist() {
  const artworksWithoutArtist = await ArtworkRepository.findAll({ where: { artistId: null } });

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Artist</h1>
      </div>

      <section className="mt-8">
        <ArtistCreateForm artworks={artworksWithoutArtist} />
      </section>
    </div>
  );
}

export default CreateArtist;

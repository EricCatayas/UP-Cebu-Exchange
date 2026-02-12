import EditArtworkForm from '@/components/admin/EditArtworkForm';
import ArtistService from '@/services/ArtistService';
import ArtworkService from '@/services/ArtworkService';
import StylesService from '@/services/StylesService';
import TagsService from '@/services/TagsService';
import { notFound } from 'next/navigation';
import { ARTWORK_MEDIUMS } from '@/lib/constants';

async function EditInventory({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);

  const artworkService = new ArtworkService();
  const artwork = await artworkService.getArtworkById(id);

  if (!artwork) {
    return notFound();
  }

  const allArtists = await ArtistService.getAllArtists();
  const artworkStyles = await StylesService.getAllStyles();

  const allTags = await TagsService.getAllTags();
  const artworkTags = allTags.map((tag) => tag.name);
  const artworkMediums = ARTWORK_MEDIUMS;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Artwork</h1>
        <EditArtworkForm
          artwork={artwork}
          artists={allArtists}
          mediums={artworkMediums}
          styles={artworkStyles}
          tags={artworkTags}
        />
      </div>
    </div>
  );
}

export default EditInventory;

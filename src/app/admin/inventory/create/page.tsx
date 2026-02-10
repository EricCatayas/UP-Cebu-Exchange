import CreateArtworkForm from '@/components/admin/CreateArtworkForm';
import ArtistService from '@/services/ArtistService';
import StylesService from '@/services/StylesService';
import TagsService from '@/services/TagsService';
import { ARTWORK_MEDIUMS } from '@/lib/constants';

async function CreateInventory() {
  const allArtists = await ArtistService.getAllArtists();
  const artworkStyles = await StylesService.getAllStyles();

  const allTags = await TagsService.getAllTags();
  const artworkTags = allTags.map((tag) => tag.name);
  const artworkMediums = ARTWORK_MEDIUMS;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Artwork</h1>
        <CreateArtworkForm artists={allArtists} mediums={artworkMediums} styles={artworkStyles} tags={artworkTags} />
      </div>
    </div>
  );
}

export default CreateInventory;

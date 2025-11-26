import CreateArtworkForm from '@/components/admin/CreateArtworkForm';
import ArtistService from '@/services/ArtistService';
import StylesService from '@/services/StylesService';
import TagsService from '@/services/TagsService';

async function CreateInventory() {
  const allArtists = await ArtistService.getAllArtists();
  const artworkStyles = await StylesService.getAllStyles();
  // todo: make tags dynamic based on image upload
  const allTags = await TagsService.getAllTags();
  const artworkTags = allTags.map((tag) => tag.name);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Artwork</h1>
        <CreateArtworkForm artists={allArtists} styles={artworkStyles} tags={artworkTags} />
      </div>
    </div>
  );
}

export default CreateInventory;

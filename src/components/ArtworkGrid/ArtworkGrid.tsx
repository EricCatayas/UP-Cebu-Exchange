import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';

const ArtworkGrid = ({ artworks }: { artworks: any[] }) => {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mt-6 space-y-6">
      {artworks.map((artwork) => (
        <div key={artwork.id} className="break-inside-avoid mb-6">
          <ArtworkCard artwork={artwork} />
        </div>
      ))}
    </div>
  );
};

export default ArtworkGrid;

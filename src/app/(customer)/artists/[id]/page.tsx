async function ArtistArtworks({ params }: { params: { id: string } }) {
  const id = (await params).id;
  // Todo: Display name, bio, and artworks by this artist
  return <div>Artist Artworks Page for Artist ID: {id}</div>;
}

export default ArtistArtworks;

import { Artist } from '@/models/sequelize';

class ArtistService {
  async getAllArtists() {
    const artists = await Artist.findAll();
    return artists.map((artist) => artist.toJSON());
  }
}

export default new ArtistService();

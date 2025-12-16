import { Artist } from '@/models/sequelize';

class ArtistService {
  async getAllArtists(options = {}) {
    const artists = await Artist.findAll({
      ...options,
    });
    return artists.map((artist) => artist.toJSON());
  }
}

export default new ArtistService();

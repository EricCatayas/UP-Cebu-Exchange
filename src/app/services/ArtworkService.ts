import ArtworkRepository from '@/repositories/ArtworkRepository';

class ArtworkService {
  async getAllArtworks() {
    return await ArtworkRepository.findAll();
  }

  async getArtworkById(id: number) {
    return await ArtworkRepository.findById(id);
  }

  async getArtworksFromArtist(artistId: number) {
    return await ArtworkRepository.findAll({ where: { artistId } });
  }

  async getPaginatedArtworks(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return await ArtworkRepository.findAll({ offset, limit });
  }

  async getSimilarArtworks(artworkId: number) {
    return await ArtworkRepository.findAll({ limit: 6 });
  }
}

export default new ArtworkService();

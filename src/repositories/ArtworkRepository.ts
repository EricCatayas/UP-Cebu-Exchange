import { Artwork } from '@/models/sequelize/index';

class ArtworkRepository {
  async findAll(options = {}) {
    const artworks = await Artwork.findAll({
      include: ['artist', 'tags', 'style', 'rentalPlans', 'images'],
      ...options,
    });
    return artworks.map((artwork) => artwork.toJSON());
  }

  async findById(id: number) {
    const artwork = await Artwork.findByPk(id, {
      include: ['artist', 'tags', 'style', 'rentalPlans', 'images'],
    });
    return artwork?.toJSON();
  }

  async findByStatus(status: string) {
    const artworks = await Artwork.findAll({
      where: { status },
      include: ['artist', 'tags', 'style', 'rentalPlans', 'images'],
    });
    return artworks.map((artwork) => artwork.toJSON());
  }
}

export default new ArtworkRepository();

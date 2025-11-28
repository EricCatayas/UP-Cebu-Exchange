import { Artwork, Artist, ArtworkImage, RentalPlan, Style, Tag } from '@/models/sequelize/index';
import { ArtworkDTO, PaginatedArtworks } from '@/models/Artwork';
import { PAGE_SIZE } from '@/lib/constants';

class ArtworkRepository {
  async findPaginated(
    options: { page: number; limit: number } = { page: 1, limit: PAGE_SIZE }
  ): Promise<PaginatedArtworks> {
    const page = options.page;
    const limit = options.limit;
    const offset = (page - 1) * limit;
    const { rows } = await Artwork.findAndCountAll({
      include: [
        {
          model: Artist,
          as: 'artist',
          attributes: ['id', 'name', 'biography'],
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name'],
        },
        {
          model: Style,
          as: 'style',
          attributes: ['id', 'name'],
        },
        {
          model: RentalPlan,
          as: 'rentalPlans',
          attributes: ['id', 'price', 'durationMonths'],
        },
        {
          model: ArtworkImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isPrimary'],
        },
      ],
      ...options,
      offset,
      limit,
    });
    const count = rows.length;
    let totalPages = 1;
    for (let i = count; i > 0; i -= limit) {
      totalPages++;
    }

    return {
      page,
      pageSize: count,
      nextPage: page < totalPages ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
      totalPages,
      items: rows.map((artwork) => artwork.toJSON()),
    };
  }

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

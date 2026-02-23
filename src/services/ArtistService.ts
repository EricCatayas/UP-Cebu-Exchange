import { ArtistDTO } from '@/models/Artist';
import { Artist, Artwork, ArtworkImage, RentalPlan, Style, Tag } from '@/models/sequelize';

class ArtistService {
  async getArtistById(id: number): Promise<ArtistDTO | null> {
    const artist = await Artist.findByPk(id, {
      include: [
        {
          model: Artwork,
          as: 'artworks',
          include: [
            {
              model: Tag,
              as: 'tags',
              attributes: ['id', 'name'],
              through: { attributes: [] }, // Exclude junction table data
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
        },
      ],
    });
    return artist ? (artist.toJSON() as ArtistDTO) : null;
  }

  async getAllArtists(options: {}): Promise<ArtistDTO[]> {
    const artists = await Artist.findAll({
      ...options,
      include: [
        {
          model: Artwork,
          as: 'artworks',
          include: [
            {
              model: Style,
              as: 'style',
              attributes: ['id', 'name'],
            },
            {
              model: ArtworkImage,
              as: 'images',
              attributes: ['id', 'imageUrl', 'isPrimary'],
            },
          ],
        },
      ],
    });
    return artists.map((artist) => artist.toJSON());
  }
}

export default new ArtistService();

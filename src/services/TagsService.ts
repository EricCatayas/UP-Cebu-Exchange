import { Artwork, ArtworkTag, Tag } from '@/models/sequelize';

class TagsService {
  async getAllTags(options = {}) {
    const tags = await Tag.findAll({
      ...options,
    });
    return tags.map((tag) => tag.toJSON());
  }
  async getArtworksByTag(tagId: number, options = {}) {
    const artworkTags = await ArtworkTag.findAll({
      where: { tagId },
      ...options,
    });

    return artworkTags.map((artworkTag) => artworkTag.artwork.toJSON());
  }
}

export default new TagsService();

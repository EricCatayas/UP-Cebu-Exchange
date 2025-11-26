import { Tag } from '@/models/sequelize';

class TagsService {
  async getAllTags() {
    const tags = await Tag.findAll();
    return tags.map((tag) => tag.toJSON());
  }
}

export default new TagsService();

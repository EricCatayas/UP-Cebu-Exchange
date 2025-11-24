import { Style } from '@/models/sequelize';
class StylesService {
  async getAllStyles() {
    const styles = await Style.findAll();
    return styles.map((style) => style.toJSON());
  }
}

export default new StylesService();

import { Style } from '@/models/sequelize';
class StylesService {
  async getAllStyles(options = {}) {
    const styles = await Style.findAll({
      ...options,
    });
    return styles.map((style) => style.toJSON());
  }

  async getStylesByNames(styleNames: string[]) {
    const styles = await Style.findAll({
      where: {
        name: styleNames,
      },
    });
    return styles.map((style) => style.toJSON());
  }
}

export default new StylesService();

import Style from '@/models/sequelize/Style';

export async function seedStyles() {
  try {
    const styles = [
      'Contemporary',
      'Realism',
      'Abstract',
      'Expressionism',
      'Impressionism',
      'Minimalism',
      'Surrealism',
      'Abstract Expressionism',
      'Botanical Art',
      'Folk Art',
    ];
    for (const styleName of styles) {
      await Style.findOrCreate({
        where: { name: styleName },
        defaults: { name: styleName },
      });
    }
  } catch (error) {
    console.error('❌ Error seeding styles:', error);
    throw error;
  }
}

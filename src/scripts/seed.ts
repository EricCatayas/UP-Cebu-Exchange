import sequelize from '@/config/database';
import User from '@/models/sequelize/User';
import Role from '@/models/sequelize/Role';
import Artist from '@/models/sequelize/Artist';
import Artwork from '@/models/sequelize/Artwork';
import ArtworkImage from '@/models/sequelize/ArtworkImage';
import ArtworkTag from '@/models/sequelize/ArtworkTag';
import RentalPlan from '@/models/sequelize/RentalPlan';
import Style from '@/models/sequelize/Style';
import Tag from '@/models/sequelize/Tag';
import { ARTWORK_MEDIUM, ARTWORK_STATUS, USER_ROLE } from '@/lib/constants';

export async function seedDefaultRoles() {
  try {
    console.log('🌱 Seeding default roles...');

    const defaultRoles = [
      { name: USER_ROLE.HEAD, description: 'Administrator with read-only access' },
      { name: USER_ROLE.STAFF, description: 'Staff who can modify content' },
      { name: USER_ROLE.CUSTOMER, description: 'Customer who can rent artworks' },
    ];

    for (const roleData of defaultRoles) {
      const [role, created] = await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: roleData,
      });

      if (created) {
        console.log(`✅ Created role: ${role.name}`);
      } else {
        console.log(`ℹ️  Role already exists: ${role.name}`);
      }
    }
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
  }
}

export async function seedDatabase() {
  try {
    // Artist
    const artist1 = await Artist.create({ name: 'Elena Martinez', biography: 'Realism artist' });

    // Styles
    const realismStyle = await Style.create({ name: 'Realism' });

    // Tags
    const realismTag = await Tag.create({ name: 'Realism' });
    const stillLifeTag = await Tag.create({ name: 'Still Life' });
    const flowersTag = await Tag.create({ name: 'Flowers' });
    const citrusTag = await Tag.create({ name: 'Citrus' });
    const watercolorTag = await Tag.create({ name: 'Watercolor' });
    const warmColorsTag = await Tag.create({ name: 'Warm Colors' });

    // Artwork1
    const artwork1 = await Artwork.create({
      id: 1,
      title: 'Citrus & Blooms',
      artistId: artist1.id,
      styleId: realismStyle.id,
      description:
        'A warm and cheerful still life featuring a vibrant bouquet of flowers in a red pitcher, accompanied by fresh citrus fruits.',
      medium: ARTWORK_MEDIUM.WATERCOLOR_ON_PAPER,
      status: ARTWORK_STATUS.AVAILABLE,
      heightCm: 70,
      widthCm: 50,
    });

    // Images
    await ArtworkImage.bulkCreate([
      {
        artworkId: artwork1.id,
        imageUrl:
          'https://res.cloudinary.com/dbgolykzg/image/upload/v1763016199/UP%20Cebu%20Exchange/artwork1_ibt8sz.jpg',
        isPrimary: true,
      },
      {
        artworkId: artwork1.id,
        imageUrl:
          'https://res.cloudinary.com/dbgolykzg/image/upload/v1763016199/UP%20Cebu%20Exchange/artwork1_ibt8sz.jpg',
        isPrimary: false,
      },
      {
        artworkId: artwork1.id,
        imageUrl:
          'https://res.cloudinary.com/dbgolykzg/image/upload/v1763016199/UP%20Cebu%20Exchange/artwork1_ibt8sz.jpg',
        isPrimary: false,
      },
    ]);

    // Artwork-Tag Associations
    await ArtworkTag.bulkCreate([
      { artworkId: artwork1.id, tagId: stillLifeTag.id },
      { artworkId: artwork1.id, tagId: realismTag.id },
      { artworkId: artwork1.id, tagId: flowersTag.id },
      { artworkId: artwork1.id, tagId: citrusTag.id },
      { artworkId: artwork1.id, tagId: watercolorTag.id },
      { artworkId: artwork1.id, tagId: warmColorsTag.id },
    ]);

    // RentalPlan
    await RentalPlan.bulkCreate([
      { artworkId: artwork1.id, durationMonths: 3, rentalFee: 1100 },
      { artworkId: artwork1.id, durationMonths: 6, rentalFee: 2000 },
      { artworkId: artwork1.id, durationMonths: 12, rentalFee: 3500 },
    ]);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
  }
}

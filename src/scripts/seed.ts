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
import { hashPassword } from '@/lib/auth';

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

export async function seedUsers() {
  try {
    const customerRole = await Role.findOne({
      where: { name: USER_ROLE.CUSTOMER },
    });
    const adminRole = await Role.findOne({
      where: { name: USER_ROLE.STAFF },
    });

    // customer account
    const userPassword = await hashPassword('user123');
    await User.findOrCreate({
      where: { email: 'user1@test.com' },
      defaults: {
        email: 'user1@test.com',
        fullName: 'User One',
        password: userPassword,
        roleId: customerRole.id,
        status: 'Active',
      },
    });
    // admin account
    const adminPassword = await hashPassword('admin123');
    await User.findOrCreate({
      where: { email: 'admin@test.com' },
      defaults: {
        email: 'admin@test.com',
        fullName: 'Admin User',
        password: adminPassword,
        roleId: adminRole.id,
        status: 'Active',
      },
    });
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

export async function seedDatabase() {
  try {
    const artistsData = [
      {
        name: 'Claire Compton',
        biography: 'A contemporary artist known for her vibrant interpretation of everyday life.',
        title: 'Whispers of Dawn',
        description: 'A gentle depiction of morning light passing through soft curtains.',
        style: 'Contemporary',
        medium: ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
        heightCm: 80,
        widthCm: 60,
        tags: ['Light', 'Soft Tones', 'Minimalism', 'Calm'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274796/artwork2_exnb9a.png', isPrimary: true },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274796/artwork2_exnb9a.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274796/artwork2_exnb9a.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Abner Abbott',
        biography: 'A realism painter specializing in landscapes and rural scenery.',
        title: 'Golden Fields',
        description: 'An expansive golden wheat field under the warm glow of sunset.',
        style: 'Realism',
        medium: ARTWORK_MEDIUM.OIL_ON_CANVAS,
        heightCm: 70,
        widthCm: 50,
        tags: ['Landscape', 'Fields', 'Sunset', 'Warm Colors'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274804/artwork13_ppj9q3.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274804/artwork13_ppj9q3.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274804/artwork13_ppj9q3.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Melany Foley',
        biography: 'An abstract artist who explores emotion through bold color fields.',
        title: 'Echoes in Blue',
        description: 'Layered shades of blue forming a deep emotional composition.',
        style: 'Abstract',
        medium: ARTWORK_MEDIUM.MIXED_MEDIA,
        heightCm: 90,
        widthCm: 70,
        tags: ['Abstract', 'Blue Palette', 'Emotion', 'Texture'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/placeholder/melany1_primary.jpg', isPrimary: true },
          { url: 'https://res.cloudinary.com/placeholder/melany1_img2.jpg', isPrimary: false },
          { url: 'https://res.cloudinary.com/placeholder/melany1_img3.jpg', isPrimary: false },
        ],
      },

      {
        name: 'Mohammad Bernal',
        biography: 'An expressionist painter focusing on social themes and human emotion.',
        title: 'Voices of the Street',
        description: 'A dynamic piece capturing the energy and tension of urban life.',
        style: 'Expressionism',
        medium: ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
        heightCm: 85,
        widthCm: 65,
        tags: ['Expressionism', 'Urban Life', 'Bold Colors', 'Humanity'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274802/artwork12_ldawhy.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274802/artwork12_ldawhy.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274802/artwork12_ldawhy.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Emmeline Day',
        biography: 'Known for her soft watercolor works depicting nature and tranquility.',
        title: 'Still Waters',
        description: 'A serene lakeside view painted with delicate watercolor washes.',
        style: 'Impressionism',
        medium: ARTWORK_MEDIUM.WATERCOLOR_ON_PAPER,
        heightCm: 60,
        widthCm: 45,
        tags: ['Watercolor', 'Nature', 'Lake', 'Tranquil'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274801/artwork11_ff3ilz.pngjpg',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274801/artwork11_ff3ilz.pngjpg',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274801/artwork11_ff3ilz.pngjpg',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Kayson Rios',
        biography: 'A digital-to-traditional crossover artist experimenting with neon palettes.',
        title: 'Electric Mirage',
        description: 'A vibrant cityscape illuminated by surreal neon hues.',
        style: 'Contemporary',
        medium: ARTWORK_MEDIUM.MIXED_MEDIA,
        heightCm: 95,
        widthCm: 70,
        tags: ['Neon', 'Cityscape', 'Modern', 'Color Pop'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274801/artwork10_pbptsq.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274801/artwork10_pbptsq.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274801/artwork10_pbptsq.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Brooke Mayer',
        biography: 'A botanical illustrator blending realism with gentle fantasy details.',
        title: 'Petals of Spring',
        description: 'A detailed bloom study featuring soft pink petals and gold accents.',
        style: 'Realism',
        medium: ARTWORK_MEDIUM.WATERCOLOR_ON_PAPER,
        heightCm: 65,
        widthCm: 50,
        tags: ['Flowers', 'Botanical', 'Realism', 'Spring'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274801/artwork9_usefgq.png', isPrimary: true },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274801/artwork9_usefgq.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274801/artwork9_usefgq.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Yahir Strickland',
        biography: 'A surrealist painter known for dreamlike landscapes.',
        title: 'Between Two Worlds',
        description: 'Floating islands and shifting skies form an otherworldly realm.',
        style: 'Abstract',
        medium: ARTWORK_MEDIUM.OIL_ON_CANVAS,
        heightCm: 100,
        widthCm: 80,
        tags: ['Surreal', 'Dreamlike', 'Sky', 'Fantasy'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274800/artwork8_aqwm1m.png', isPrimary: true },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274800/artwork8_aqwm1m.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274800/artwork8_aqwm1m.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Nia York',
        biography: 'A minimalist artist who conveys emotion through simplicity.',
        title: 'Quiet',
        description: 'A single line bending gently over a muted gray background.',
        style: 'Minimalism',
        medium: ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
        heightCm: 55,
        widthCm: 40,
        tags: ['Minimalism', 'Line Art', 'Soft Tones', 'Modern'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork7_xnda0x.png', isPrimary: true },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork7_xnda0x.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork7_xnda0x.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Leandro Bautista',
        biography: 'A Filipino painter focusing on cultural symbolism and heritage.',
        title: 'Roots of Home',
        description: 'A symbolic composition of Filipino motifs and traditional patterns.',
        style: 'Contemporary',
        medium: ARTWORK_MEDIUM.MIXED_MEDIA,
        heightCm: 75,
        widthCm: 55,
        tags: ['Culture', 'Symbolism', 'Filipino', 'Heritage'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork7_xnda0x.png', isPrimary: true },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork7_xnda0x.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork7_xnda0x.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Antonella Mathis',
        biography: 'A wildlife painter capturing animals in expressive poses.',
        title: 'Grace of the Wild',
        description: 'A vivid portrayal of a fox mid-leap through a snowy forest.',
        style: 'Realism',
        medium: ARTWORK_MEDIUM.OIL_ON_CANVAS,
        heightCm: 80,
        widthCm: 60,
        tags: ['Wildlife', 'Animals', 'Realism', 'Nature'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork5_dpdghu.png', isPrimary: true },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork5_dpdghu.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork5_dpdghu.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Gustavo Spence',
        biography: 'A geometric abstract artist specializing in sharp shapes and contrast.',
        title: 'Fragmented Vision',
        description: 'Intersecting triangles forming a complex optical pattern.',
        style: 'Abstract',
        medium: ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
        heightCm: 90,
        widthCm: 70,
        tags: ['Geometric', 'Sharp Lines', 'Contrast', 'Modern'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork4_xpawbd.png', isPrimary: true },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork4_xpawbd.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork4_xpawbd.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Aislinn Walter',
        biography: 'A children’s book-inspired illustrator with soft pastel palettes.',
        title: 'Dreamtime Meadow',
        description: 'A whimsical meadow filled with pastel creatures and tiny stories.',
        style: 'Contemporary',
        medium: ARTWORK_MEDIUM.WATERCOLOR_ON_PAPER,
        heightCm: 60,
        widthCm: 45,
        tags: ['Whimsical', 'Pastel', 'Illustration', 'Meadow'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork6_rqftrl.png', isPrimary: true },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork6_rqftrl.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork6_rqftrl.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Lochlan Sherman',
        biography: 'A dramatic landscape painter known for storm and sky studies.',
        title: 'Tempest Rising',
        description: 'A powerful depiction of storm clouds building over a cliffside.',
        style: 'Impressionism',
        medium: ARTWORK_MEDIUM.OIL_ON_CANVAS,
        heightCm: 95,
        widthCm: 75,
        tags: ['Storm', 'Sky', 'Landscape', 'Drama'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork1_p8nfna.png', isPrimary: true },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork1_p8nfna.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274797/artwork1_p8nfna.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Aislinn Walter',
        biography: 'A minimalist painter celebrated for serene compositions and soft tonal gradients.',
        title: 'Quiet Horizons',
        description: 'A calm and ethereal abstract landscape blending muted tones for a peaceful atmosphere.',
        style: 'Minimalism',
        medium: ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
        heightCm: 80,
        widthCm: 60,
        tags: ['Minimalist', 'Calm', 'Soft Tones', 'Abstract'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274796/artwork14_sd65hi.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274796/artwork14_sd65hi.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274796/artwork14_sd65hi.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Gustavo Spence',
        biography: 'A surrealist artist known for dreamlike scenes merging reality with fantasy.',
        title: 'The Sleeping Garden',
        description: 'A surreal dreamscape where flowers float midair and shadows distort into new forms.',
        style: 'Surrealism',
        medium: ARTWORK_MEDIUM.MIXED_MEDIA,
        heightCm: 90,
        widthCm: 70,
        tags: ['Surreal', 'Dreamscape', 'Fantasy', 'Conceptual'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274796/artwork3_ysropz.png', isPrimary: true },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274796/artwork3_ysropz.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763274796/artwork3_ysropz.png',
            isPrimary: false,
          },
        ],
      },
    ];

    for (let i = 0; i < artistsData.length; i++) {
      const data = artistsData[i];

      // 1. Create Artist
      const artist = await Artist.create({
        name: data.name,
        biography: data.biography,
      });

      // 2. Create Style
      const [style] = await Style.findOrCreate({
        where: { name: data.style },
        defaults: { name: data.style },
      });

      // 3. Create Artwork
      const artwork = await Artwork.create({
        title: data.title,
        artistId: artist.id,
        styleId: style.id,
        description: data.description,
        medium: data.medium,
        status: ARTWORK_STATUS.AVAILABLE,
        heightCm: data.heightCm,
        widthCm: data.widthCm,
      });

      // 4. Create Artwork Images
      await ArtworkImage.bulkCreate(
        data.imageUrls.map((img) => ({
          artworkId: artwork.id,
          imageUrl: img.url,
          isPrimary: img.isPrimary,
        }))
      );

      // 5. Tags
      for (const tagName of data.tags) {
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName },
          defaults: { name: tagName },
        });

        await ArtworkTag.create({
          artworkId: artwork.id,
          tagId: tag.id,
        });
      }

      // 6. Rental Plans (same for each artwork)
      await RentalPlan.bulkCreate([
        { artworkId: artwork.id, durationMonths: 3, rentalFee: 1100 },
        { artworkId: artwork.id, durationMonths: 6, rentalFee: 2000 },
        { artworkId: artwork.id, durationMonths: 12, rentalFee: 3500 },
      ]);

      console.log(`🎨 Created Artwork: ${data.title}`);
    }
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
  }
}

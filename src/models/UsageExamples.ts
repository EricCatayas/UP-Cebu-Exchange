import sequelize from '@/config/database';
import User from '@/models/sequelize/User';
import Role from '@/models/sequelize/Role';
import Artist from '@/models/sequelize/Artist';
import Artwork from '@/models/sequelize/Artwork';
import ArtworkTag from '@/models/sequelize/ArtworkTag';
import Tag from '@/models/sequelize/Tag';

// Artwork Tags
const modernTag = await Tag.create({ name: 'Modern' });
const realismTag = await Tag.create({ name: 'Realism' });

// Create artwork
const artwork = await Artwork.create({
  title: 'Beautiful Painting',
  description: 'A stunning piece',
  medium: 'Oil on Canvas',
  heightCm: 50,
  widthCm: 70,
});

// Alternative: Direct junction table creation
await ArtworkTag.create({
  artworkId: artwork.id,
  tagId: modernTag.id,
});

await ArtworkTag.create({
  artworkId: artwork.id,
  tagId: realismTag.id,
});

// Or bulk create for multiple associations
await ArtworkTag.bulkCreate([
  { artworkId: artwork.id, tagId: modernTag.id },
  { artworkId: artwork.id, tagId: realismTag.id },
]);

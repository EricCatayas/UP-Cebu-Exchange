import sequelize from '@/config/database';
import User from './User';
import Role from './Role';
import Artist from './Artist';
import Artwork from './Artwork';
import ArtworkTag from './ArtworkTag';
import Tag from './Tag';

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

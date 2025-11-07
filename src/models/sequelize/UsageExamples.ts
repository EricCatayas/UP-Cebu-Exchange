import sequelize from '@/config/database';
import User from './User';
import Role from './Role';
import Artist from './Artist';
import Artwork from './Artwork';
import Address from './Address';
import Style from './Style';
import ArtworkStyle from './ArtworkStyle';

// Artwork Styles
const modernStyle = await Style.create({ name: 'Modern' });
const realismStyle = await Style.create({ name: 'Realism' });

// Create artwork
const artwork = await Artwork.create({
  title: 'Beautiful Painting',
  description: 'A stunning piece',
  medium: 'Oil on Canvas',
  heightCm: 50,
  widthCm: 70,
});

// Associate artwork with styles
// Sequelize generates methods like addStyles(), removeStyles(), hasStyles(), etc.
// await artwork.addStyles([modernStyle, realismStyle]); 
// Or individually: await artwork.addStyle(modernStyle);

// Alternative: Direct junction table creation
await ArtworkStyle.create({
  artworkId: artwork.id,
  styleId: modernStyle.id
});

await ArtworkStyle.create({
  artworkId: artwork.id,
  styleId: realismStyle.id
});

// Or bulk create for multiple associations
await ArtworkStyle.bulkCreate([
  { artworkId: artwork.id, styleId: modernStyle.id },
  { artworkId: artwork.id, styleId: realismStyle.id }
]);
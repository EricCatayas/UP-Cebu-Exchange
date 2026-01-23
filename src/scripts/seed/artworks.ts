import Artist from '@/models/sequelize/Artist';
import Artwork from '@/models/sequelize/Artwork';
import ArtworkImage from '@/models/sequelize/ArtworkImage';
import ArtworkTag from '@/models/sequelize/ArtworkTag';
import RentalPlan from '@/models/sequelize/RentalPlan';
import Style from '@/models/sequelize/Style';

import Tag from '@/models/sequelize/Tag';
import { ARTWORK_MEDIUM, ARTWORK_STATUS } from '@/lib/constants';

export async function seedArtworks() {
  try {
    const artistsData = [
      {
        name: 'Claire Compton',
        biography: 'A contemporary artist known for her vibrant interpretation of everyday life.',
        title: 'Whispers of Dawn',
        description: 'A gentle depiction of morning light passing through soft curtains.',
        style: 'Contemporary',
        medium: ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
        price: 250,
        heightCm: 80,
        widthCm: 60,
        tags: ['Light', 'Soft Tones', 'Minimalism', 'Calm'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/betweentwoworlds_sqwlrt.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/betweentwoworlds_sqwlrt.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/betweentwoworlds_sqwlrt.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Elias Hartmann',
        biography: 'A nature-inspired painter celebrated for serene landscapes and reflective waters.',
        title: 'Waters Echo',
        description: 'A calm lakeside scene at dusk, where fading sunlight mirrors across glassy water.',
        style: 'Realism',
        medium: ARTWORK_MEDIUM.OIL_ON_CANVAS,
        price: 320,
        heightCm: 90,
        widthCm: 70,
        tags: ['Lake', 'Sunset', 'Reflection', 'Nature', 'Tranquil'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/watersecho_ynrwzp.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/watersecho_ynrwzp.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/watersecho_ynrwzp.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Marina Solis',
        biography: 'A modern impressionist known for expressive brushstrokes and warm, atmospheric scenery.',
        title: 'Ripples of Morning',
        description: 'Soft ripples form across a quiet lake as gentle sunrise colors spill across the horizon.',
        style: 'Impressionism',
        medium: ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
        price: 270,
        heightCm: 75,
        widthCm: 55,
        tags: ['Lake', 'Sunset', 'Reflection', 'Nature', 'Tranquil'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/ripplesofmorning_leudyi.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/ripplesofmorning_leudyi.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/ripplesofmorning_leudyi.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Rowan Adler',
        biography: 'A minimalist artist who explores muted palettes and peaceful natural environments.',
        title: 'Silent Lake',
        description: 'A nearly monochromatic portrayal of a fog-covered lake, where land and sky blend softly.',
        style: 'Minimalism',
        medium: ARTWORK_MEDIUM.WATERCOLOR_ON_PAPER,
        price: 190,
        heightCm: 60,
        widthCm: 45,
        tags: ['Lake', 'Fog', 'Nature', 'Tranquil'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/silentlake_gozvcc.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/silentlake_gozvcc.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/silentlake_gozvcc.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Helena Brooks',
        biography: 'A vibrant colorist whose works highlight dramatic skies and luminous waters.',
        title: 'Lake of Lights',
        description: 'Colorful reflections dance across a lake under a glowing twilight sky.',
        style: 'Expressionism',
        medium: ARTWORK_MEDIUM.OIL_ON_CANVAS,
        price: 380,
        heightCm: 85,
        widthCm: 65,
        tags: ['Lake', 'Sunset', 'Abstract', 'Nature', 'Reflection', 'Sky'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/lakeoflights_b0zoew.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/lakeoflights_b0zoew.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/lakeoflights_b0zoew.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Soren Vale',
        biography: 'A contemporary realist known for capturing peaceful natural retreats and untouched scenery.',
        title: 'Midnight Lake',
        description: 'A moonlit lake surrounded by dark pine silhouettes, illuminated by a silver glow.',
        style: 'Contemporary Realism',
        medium: ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
        price: 295,
        heightCm: 70,
        widthCm: 52,
        tags: ['Lake', 'Reflection', 'Moonlight', 'Nature', 'Tranquil', 'Cool Tones'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/midnightlake_rcaojg.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/midnightlake_rcaojg.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765585292/midnightlake_rcaojg.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Riley Stonehart',
        biography: 'A minimalist artist focusing on simplified forms and natural color harmony.',
        title: 'Ocean Line',
        description: 'A minimal horizon line separating sea and sky with soft gradient transitions.',
        style: 'Minimalism',
        medium: ARTWORK_MEDIUM.PENCIL_ON_PAPER,
        price: 180,
        heightCm: 60,
        widthCm: 45,
        tags: ['Ocean', 'Minimalism', 'Horizon', 'Soft Gradient', 'Nature', 'Tranquil', 'Calm'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418397/oceanline_wpckkj.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418397/oceanline_wpckkj.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418397/oceanline_wpckkj.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Sophie Delacroix',
        biography: 'A surrealist painter exploring symbolic landscapes inspired by the subconscious.',
        title: 'Waves of Memory',
        description: 'Surreal floating islands drifting above a vast blue ocean under a glowing moon.',
        style: 'Surrealism',
        medium: ARTWORK_MEDIUM.OIL_ON_CANVAS,
        price: 410,
        heightCm: 100,
        widthCm: 80,
        tags: ['Ocean', 'Surreal', 'Dreamscape', 'Symbolism'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418396/wavesofmemory_ttp4lp.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418396/wavesofmemory_ttp4lp.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418396/wavesofmemory_ttp4lp.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Liam Crestwood',
        biography: 'A contemporary impressionist capturing fleeting coastal moments and shifting light.',
        title: 'Shoreline Breeze',
        description: 'Loose, textured brushstrokes showing wind dancing across ocean waves.',
        style: 'Impressionism',
        medium: ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
        price: 300,
        heightCm: 85,
        widthCm: 65,
        tags: ['Ocean', 'Coastal', 'Impressionism', 'Wind', 'Waves', 'Blue'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418396/shorelinebreeze_qsivy9.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418396/shorelinebreeze_qsivy9.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418396/shorelinebreeze_qsivy9.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Evan Marlowe',
        biography: 'An abstract visualist whose works capture the rhythm and movement of natural forces.',
        title: 'Tides in Motion',
        description: 'A swirling abstract representation of waves colliding under shifting blue hues.',
        style: 'Impressionism',
        medium: ARTWORK_MEDIUM.OIL_ON_CANVAS,
        price: 320,
        heightCm: 90,
        widthCm: 70,
        tags: ['Ocean', 'Waves', 'Blue', 'Dynamic', 'Impressionism'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418396/tidesofmotion_wk0y8l.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418396/tidesofmotion_wk0y8l.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1765418396/tidesofmotion_wk0y8l.png',
            isPrimary: false,
          },
        ],
      },

      ,
      {
        name: 'Antonella Mathis',
        biography: 'A wildlife painter capturing animals in expressive poses.',
        title: 'Golden Fields',
        description: 'An expansive golden wheat field under the warm glow of sunset.',
        style: 'Realism',
        medium: ARTWORK_MEDIUM.OIL_ON_CANVAS,
        price: 350,
        heightCm: 70,
        widthCm: 50,
        tags: ['Landscape', 'Fields', 'Sunset', 'Warm Colors'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713973/goldenfields_ttiq3i.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713973/goldenfields_ttiq3i.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713973/goldenfields_ttiq3i.png',
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
        price: 400,
        heightCm: 90,
        widthCm: 70,
        tags: ['Abstract', 'Blue Palette', 'Emotion', 'Texture'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713973/goldenfields_ttiq3i.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713973/goldenfields_ttiq3i.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713973/goldenfields_ttiq3i.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Mohammad Bernal',
        biography: 'An expressionist painter focusing on social themes and human emotion.',
        title: 'Voices of the Street',
        description: 'A dynamic piece capturing the energy and tension of urban life.',
        style: 'Expressionism',
        medium: ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
        price: 400,
        heightCm: 85,
        widthCm: 65,
        tags: ['Expressionism', 'Urban Life', 'Bold Colors', 'Humanity'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713973/voicesofthestreet_raq0ko.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713973/voicesofthestreet_raq0ko.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713973/voicesofthestreet_raq0ko.png',
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
        price: 250,
        heightCm: 60,
        widthCm: 45,
        tags: ['Watercolor', 'Soft Tones', 'Nature', 'Lake', 'Calm', 'Tranquil'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/stillwaters_uf7sng.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/stillwaters_uf7sng.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/stillwaters_uf7sng.png',
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
        price: 300,
        heightCm: 95,
        widthCm: 70,
        tags: ['Neon', 'Cityscape', 'Modern', 'Color Pop'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/electricmirage_mssirc.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/electricmirage_mssirc.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/electricmirage_mssirc.png',
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
        price: 500,
        heightCm: 65,
        widthCm: 50,
        tags: ['Flowers', 'Botanical', 'Realism', 'Spring'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/petalsofspring_mjq65y.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/petalsofspring_mjq65y.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/petalsofspring_mjq65y.png',
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
        price: 700,
        heightCm: 100,
        widthCm: 80,
        tags: ['Surreal', 'Dreamlike', 'Sky', 'Fantasy'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/betweentwoworlds_sqwlrt.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/betweentwoworlds_sqwlrt.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/betweentwoworlds_sqwlrt.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Aislinn Walter',
        biography: 'A minimalist artist who conveys emotion through simplicity.',
        title: 'Quiet',
        description: 'A single line bending gently over a muted gray background.',
        style: 'Minimalism',
        medium: ARTWORK_MEDIUM.PENCIL_ON_PAPER,
        price: 400,
        heightCm: 55,
        widthCm: 40,
        tags: ['Minimalism', 'Line Art', 'Soft Tones', 'Modern'],
        imageUrls: [
          { url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/quiet_nrva8k.png', isPrimary: true },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/quiet_nrva8k.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/quiet_nrva8k.png',
            isPrimary: false,
          },
        ],
      },

      {
        name: 'Kayson Rios',
        biography: 'A digital-to-traditional crossover artist experimenting with neon palettes.',
        title: 'Roots of Home',
        description: 'A symbolic composition of Filipino motifs and traditional patterns.',
        style: 'Contemporary',
        medium: ARTWORK_MEDIUM.MIXED_MEDIA,
        price: 400,
        heightCm: 75,
        widthCm: 55,
        tags: ['Culture', 'Symbolism', 'Filipino', 'Heritage'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/rootsofhome_r9eijc.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/rootsofhome_r9eijc.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/rootsofhome_r9eijc.png',
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
        price: 600,
        heightCm: 80,
        widthCm: 60,
        tags: ['Wildlife', 'Animals', 'Realism', 'Nature'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/graceofthewild_jq4bxm.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/graceofthewild_jq4bxm.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/graceofthewild_jq4bxm.png',
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
        price: 750,
        heightCm: 90,
        widthCm: 70,
        tags: ['Geometric', 'Sharp Lines', 'Contrast', 'Modern'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/fragmentedvision_qwgdjm.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/fragmentedvision_qwgdjm.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/fragmentedvision_qwgdjm.png',
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
        price: 800,
        heightCm: 60,
        widthCm: 45,
        tags: ['Whimsical', 'Pastel', 'Illustration', 'Meadow'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/dreamtimemeadow_bgbn53.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/dreamtimemeadow_bgbn53.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713972/dreamtimemeadow_bgbn53.png',
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
        price: 600,
        heightCm: 95,
        widthCm: 75,
        tags: ['Coastal', 'Storm', 'Sky', 'Landscape', 'Impressionism'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/tempestrising_cyfexl.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/tempestrising_cyfexl.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/tempestrising_cyfexl.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Aislinn Walter',
        biography: 'A minimalist artist who conveys emotion through simplicity.',
        title: 'Quiet Horizons',
        description: 'A calm and ethereal abstract landscape blending muted tones for a peaceful atmosphere.',
        style: 'Minimalism',
        medium: ARTWORK_MEDIUM.WATERCOLOR_ON_PAPER,
        price: 400,
        heightCm: 80,
        widthCm: 60,
        tags: ['Minimalism', 'Soft Tones', 'Watercolor', 'Nature', 'Calm', 'Tranquil'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/quiethorizon_lepl8i.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/quiethorizon_lepl8i.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/quiethorizon_lepl8i.png',
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
        price: 850,
        heightCm: 90,
        widthCm: 70,
        tags: ['Surreal', 'Dreamscape', 'Fantasy', 'Conceptual'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/sleepinggarden_c3vm02.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/sleepinggarden_c3vm02.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/sleepinggarden_c3vm02.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Leandro Bautista',
        biography: 'A Filipino mixed-media artist blending cultural motifs with modern symbolism.',
        title: 'Threads of Heritage',
        description:
          'A vibrant piece combining geometric shapes and traditional patterns representing cultural identity.',
        style: 'Folk Art',
        medium: ARTWORK_MEDIUM.MIXED_MEDIA,
        price: 600,
        heightCm: 88,
        widthCm: 68,
        tags: ['Culture', 'Folk Art', 'Patterns', 'Symbolism'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/threadsofheritage_vnncqj.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/threadsofheritage_vnncqj.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/threadsofheritage_vnncqj.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Mohammad Bernal',
        biography: 'An expressionist painter focusing on social themes and human emotion.',
        title: 'Veins of Heart',
        description: 'A dynamic abstraction using overlapping strokes that mimic flowing streams of light.',
        style: 'Abstract Expressionism',
        medium: ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
        price: 550,
        heightCm: 92,
        widthCm: 72,
        tags: ['Abstract', 'Textures', 'Expressionism', 'Light'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/veinsofheart_bzfsbh.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/veinsofheart_bzfsbh.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/veinsofheart_bzfsbh.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Brooke Mayer',
        biography: 'A watercolor artist specializing in botanical illustrations with soft natural tones.',
        title: 'Whispers of Spring',
        description: 'A delicate watercolor portrait of blooming flowers with subtle gradients and details.',
        style: 'Botanical Art',
        medium: ARTWORK_MEDIUM.WATERCOLOR_ON_PAPER,
        price: 450,
        heightCm: 65,
        widthCm: 45,
        tags: ['Botanical', 'Flowers', 'Watercolor', 'Nature'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/whispersofspring_muc0ay.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/whispersofspring_muc0ay.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/whispersofspring_muc0ay.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Yahir Strickland',
        biography: 'A digital artist known for vibrant neon-inspired futuristic landscapes.',
        title: 'Neon Pulse',
        description: 'A cyberpunk cityscape glowing with electric lights and reflective surfaces.',
        style: 'Digital Futurism',
        medium: ARTWORK_MEDIUM.DIGITAL_PRINT,
        price: 399,
        heightCm: 80,
        widthCm: 55,
        tags: ['Digital', 'Futuristic', 'Neon', 'Cityscape'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/neonpulse_yum20q.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/neonpulse_yum20q.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713971/neonpulse_yum20q.png',
            isPrimary: false,
          },
        ],
      },
      {
        name: 'Kayson Rios',
        biography: 'A charcoal sketch artist focusing on dramatic contrast and storytelling.',
        title: 'Shadows of Memory',
        description: 'A monochrome sketch portraying a lone figure walking through dim alleyways.',
        style: 'Charcoal Realism',
        medium: ARTWORK_MEDIUM.CHARCOAL_ON_PAPER,
        price: 549,
        heightCm: 75,
        widthCm: 55,
        tags: ['Charcoal', 'Monochrome', 'Realism', 'Narrative'],
        imageUrls: [
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/shadowsofmemory_zgxbu8.png',
            isPrimary: true,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/shadowsofmemory_zgxbu8.png',
            isPrimary: false,
          },
          {
            url: 'https://res.cloudinary.com/ddssydxrf/image/upload/v1763713970/shadowsofmemory_zgxbu8.png',
            isPrimary: false,
          },
        ],
      },
    ];

    for (let i = 0; i < artistsData.length; i++) {
      const data = artistsData[i];

      if (!data) continue;

      // 1. Create Artist
      const [artist] = await Artist.findOrCreate({
        where: { name: data.name },
        defaults: {
          name: data.name,
          biography: data.biography,
        },
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
        // persist base price if provided in seed data
        ...(typeof data.price !== 'undefined' ? { price: data.price } : {}),
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
      const basePrice = data.price;
      const monthlyDiscountRate = 0.05; // 5% discount for each additional month beyond the first

      const plans = [{ durationMonths: 3 }, { durationMonths: 6 }, { durationMonths: 12 }].map((p) => {
        return {
          artworkId: artwork.id,
          durationMonths: p.durationMonths,
          price: p.durationMonths * basePrice * (1 - monthlyDiscountRate * (p.durationMonths - 1)),
        };
      });

      await RentalPlan.bulkCreate(plans);
    }
  } catch (error) {
    console.error('❌ Error seeding artworks:', error);
    throw error;
  }
}

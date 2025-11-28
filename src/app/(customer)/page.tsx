import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid';
import ArtworkCarousel from '@/components/ArtworkCarousel/ArtworkCarousel';
import HeroBackground from '@/components/HeroBackground/HeroBackground';
import ArtworkService from '@/services/ArtworkService';
import StylesService from '@/services/StylesService';
import Link from 'next/link';

export default async function Page() {
  const artworkService = new ArtworkService();
  const favorite_artworks = await artworkService.getFavoriteArtworks();
  const recommended_artworks = await artworkService.getRecommendedArtworks();

  const categories = [
    {
      name: 'Expressionism',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763961737/UP%20Cebu%20Exchange/Expressionism_3x4_v3rsvf.jpg',
    },
    {
      name: 'Realism',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763961747/UP%20Cebu%20Exchange/Realism_4x3_yqbvq4.jpg',
    },
    {
      name: 'Abstract',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763961736/UP%20Cebu%20Exchange/abstract_1x1_clixmp.jpg',
    },
    {
      name: 'Folk Art',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763961737/UP%20Cebu%20Exchange/folkart_1x1_evgkmm.jpg',
    },
    {
      name: 'Impressionism',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763961740/UP%20Cebu%20Exchange/Landscape_2x1_p8hqta.jpg',
    },
    {
      name: 'Contemporary',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763961737/UP%20Cebu%20Exchange/contemporary_2x3_u2fzsj.jpg',
    },
  ];

  const styles = await StylesService.getStylesByNames(categories.map((c) => c.name));
  categories.forEach((category) => {
    const style = styles.find((s) => s.name === category.name);
    if (style) {
      category.id = style.id;
    }
  });

  return (
    <>
      <HeroBackground>
        <div className="container mx-auto px-4 text-black text-left">
          <h1 className="font-playfair text-5xl md:text-7xl font-medium mb-2">Discover Art</h1>
          <h1 className="font-poppins text-4xl md:text-6xl font-regular mb-6">from UP Cebu</h1>
          <p className="font-poppins text-lg md:text-xl mb-8 max-w-2xl font-regular">
            We offer painting rentals crafted by the next generation of Filipino artists from the University of the
            Philippines Cebu
          </p>
          <Link
            href="/artworks"
            className="bg-secondary text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Explore Paintings
          </Link>
        </div>
      </HeroBackground>
      <div className="container mx-auto px-4 pb-4">
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-6">A Few of our Favorites</h2>
          <div
            style={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))',
            }}
          >
            {favorite_artworks.map((a) => (
              <ArtworkCard key={a.id} artwork={a} displayInfo={false} />
            ))}
          </div>
        </section>
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-6">Curated for You</h2>
          <ArtworkCarousel artworks={recommended_artworks} />
        </section>
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-6">Explore by Category</h2>
          <CategoryGrid categories={categories} />
        </section>
        <section className="py-12">
          <h2 className="text-3xl mb-6">Bring Art to your space</h2>
          <p className="mb-4">
            Receive updates on the latest artwork rentals perfect for business displays, events, and creative spaces.
            Sign up to discover new collections from UP Cebu's emerging artists.
          </p>
          <div className="flex gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 border rounded" />
            <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors">
              Join our Mailing List
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

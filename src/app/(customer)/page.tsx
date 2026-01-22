import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid';
import ArtworkCarousel from '@/components/ArtworkCarousel/ArtworkCarousel';
import HeroBackground from '@/components/HeroBackground/HeroBackground';
import ArtworksDisplay from '@/components/ArtworksDisplay/ArtworksDisplay';
import HomeSlider from '@/components/Slider/HomeSlider';
import ArtworkService from '@/services/ArtworkService';
import StylesService from '@/services/StylesService';
import Link from 'next/link';

// todo: log browse event when user clicks paintings?
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

  // todo: optimize - wrap in suspense
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
        <div className="container mx-auto pl-24 text-left">
          <h1 className="font-lora font-medium text-8xl mb-4 w-fit leading-tight bg-gradient-to-tr from-[#e53e44] to-[#e5ca48] bg-clip-text text-transparent slide-in-delay-300">
            Discover Art
            <br />
            from UP Cebu
          </h1>
          <p className="font-lora font-bold text-white text-lg md:text-xl mb-8 max-w-2xl slide-in-delay-400">
            We offer painting rentals crafted by the next generation of Filipino artists from the University of the
            Philippines Cebu
          </p>
          <Link
            href="/artworks"
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold transition-colors slide-in-delay-500"
          >
            Explore Paintings
          </Link>
        </div>
      </HeroBackground>
      <div className="container px-8 py-6 max-w-7xl mx-auto">
        <section className="pb-12">
          <h2 className="text-3xl font-bold mb-6 slide-right-delay-600">A Few of our Favorites</h2>
          <ArtworksDisplay artworks={favorite_artworks} />
          {/* <ArtworksRandomized artworks={favorite_artworks} /> */}
        </section>
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-6 slide-right-delay-600">Curated for You</h2>
          <ArtworkCarousel artworks={recommended_artworks} />
        </section>
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-6 slide-right-delay-600">Explore by Category</h2>
          <CategoryGrid categories={categories} />
        </section>
        <section className="py-12">
          <HomeSlider />
        </section>
      </div>
    </>
  );
}

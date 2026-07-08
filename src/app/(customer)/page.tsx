import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid';
import ArtworkCarousel from '@/components/ArtworkCarousel/ArtworkCarousel';
import HeroBackground from '@/components/HeroBackground/HeroBackground';
import ArtworksDisplay from '@/components/ArtworksDisplay/ArtworksDisplay';
import EmailNewsletter from '@/components/EmailNewsLetter/EmailNewsletter'
import HomeSlider from '@/components/Slider/HomeSlider';
import ArtworkService from '@/services/ArtworkService';
import StylesService from '@/services/StylesService';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

// todo: log browse event when user clicks paintings?
export default async function Page() {
  const artworkService = new ArtworkService();
  const randomArtworks = await artworkService.getRandomArtworks(3);
  const user = await getCurrentUser();
  const userRecommendedArtworks = user ? await artworkService.getRecommendedArtworks(user.userId, { limit: 3 }) : [];
  const recommendedArtworks =
    userRecommendedArtworks.length > 0
      ? userRecommendedArtworks
      : await artworkService.getPopularArtworks({ limit: 3 });

  const categories = [
    {
      id: null,
      name: 'Expressionism',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763961737/UP%20Cebu%20Exchange/Expressionism_3x4_v3rsvf.jpg',
    },
    {
      id: null,
      name: 'Realism',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763961747/UP%20Cebu%20Exchange/Realism_4x3_yqbvq4.jpg',
    },
    {
      id: null,
      name: 'Abstract',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763961736/UP%20Cebu%20Exchange/abstract_1x1_clixmp.jpg',
    },
    {
      id: null,
      name: 'Folk Art',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763961737/UP%20Cebu%20Exchange/folkart_1x1_evgkmm.jpg',
    },
    {
      id: null,
      name: 'Impressionism',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763961740/UP%20Cebu%20Exchange/Landscape_2x1_p8hqta.jpg',
    },
    {
      id: null,
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
        <div className="container mx-auto px-4 sm:px-6 md:pl-12 lg:pl-24 text-left">
          <h1 className="font-lora font-medium text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-2 sm:mb-3 md:mb-4 w-fit leading-tight sm:leading-tight bg-gradient-to-tr from-[#e53e44] to-[#e5ca48] bg-clip-text text-transparent slide-in-delay-300">
            Discover Art
            <br />
            from UP Cebu
          </h1>
          <p className="font-lora font-bold text-white text-sm sm:text-md md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl slide-in-delay-400">
            We offer painting rentals crafted by the next generation of Filipino artists from the University of the
            Philippines Cebu
          </p>
          <Link
            href="/artworks"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-colors slide-in-delay-500 text-sm sm:text-base"
          >
            Explore Paintings
          </Link>
        </div>
      </HeroBackground>
      <div className="section-container">
        <section className="pb-8 sm:pb-10 md:pb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 slide-right-delay-600">
            Highlights from the Gallery
          </h2>
          <ArtworksDisplay artworks={randomArtworks} />
        </section>
        <section className="pb-8 sm:pb-10 md:pb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 slide-right-delay-600">
            Curated for You
          </h2>
          <ArtworkCarousel artworks={recommendedArtworks} />
        </section>
        <section className="pb-8 sm:pb-10 md:pb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 slide-right-delay-600">
            Explore by Category
          </h2>
          <CategoryGrid categories={categories} />
        </section>
      </div>
      <section className="pb-8 sm:pb-10 md:pb-12">
        <EmailNewsletter />
      </section>
      <div className="section-container">
        <section className="pb-8 sm:pb-10 md:pb-12">
          <HomeSlider />
        </section>
      </div>
    </>
  );
}

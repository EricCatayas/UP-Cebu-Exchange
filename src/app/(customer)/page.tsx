import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid';
import ArtworkCarousel from '@/components/ArtworkCarousel/ArtworkCarousel';
import Image from 'next/image';
import Link from 'next/link';
import { sample_artworks } from '@/models/sample-artworks';

export default function Page() {
  // TODO: Replace with real data
  const favorite_artworks = sample_artworks.slice(0, 3);
  const recommended_artworks = sample_artworks.slice(3, 9);

  const categories = [
    {
      id: 1,
      name: 'Expressionism',
      imageUrl:
        'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/3x4.png',
    },
    {
      id: 2,
      name: 'Realism',
      imageUrl:
        'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/4x3.png',
    },
    {
      id: 3,
      name: 'Abstract',
      imageUrl:
        'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/1x1.png',
    },
    {
      id: 4,
      name: 'Folk Art',
      imageUrl:
        'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/1x1.png',
    },
    {
      id: 5,
      name: 'Landscape',
      imageUrl:
        'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/2x1.png',
    },
    {
      id: 6,
      name: 'Contemporary',
      imageUrl:
        'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/2x3.png',
    },
  ];

  return (
    <div>
      {/* Landing Page */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Landing-page-bg.png"
            alt="Landing Page Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/40" />
        </div>

        <div className="relative z-10 container px-4 text-black text-left">
          <h1 className="font-playfair text-5xl md:text-7xl font-medium mb-2">
            Discover Art
          </h1>
          <h1 className="font-poppins text-4xl md:text-6xl font-regular mb-6">
            from UP Cebu
          </h1>
          <p className="font-poppins text-lg md:text-xl mb-8 max-w-2xl font-regular">
            We offer painting rentals crafted by the next generation of Filipino
            artists from the University of the Philippines Cebu
          </p>
          <Link
            href="/artworks"
            className="bg-secondary text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Explore Paintings
          </Link>
        </div>
      </section>
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
          Receive updates on the latest artwork rentals perfect for business
          displays, events, and creative spaces. Sign up to discover new
          collections from UP Cebu's emerging artists.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border rounded"
          />
          <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors">
            Join our Mailing List
          </button>
        </div>
      </section>
    </div>
  );
}

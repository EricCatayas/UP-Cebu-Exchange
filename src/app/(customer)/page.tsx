import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid';
import Image from 'next/image';

export default function Page() {
  // TODO: Replace with real data
  const favorite_artworks = [
    {
      id: 1,
      title: 'Sunset Over Cebu',
      artist: { id: 1, name: 'Juan dela Cruz' },
      description:
        'A beautiful painting capturing the essence of a Cebu sunset.',
      medium: 'oil on canvas',
      heightCm: 90,
      widthCm: 120,
      images: [
        {
          id: 1,
          isPrimary: true,
          imageUrl:
            'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-4x3.png',
        },
        {
          id: 16,
          isPrimary: false,
          imageUrl:
            'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-4x3.png',
        },
      ],
      tags: ['sunset', 'cebu', 'painting'],
      style: 'impressionism',
      rentalPlans: [
        { durationMonths: 3, rentalFee: 1500.0 },
        { durationMonths: 6, rentalFee: 2800.0 },
        { durationMonths: 12, rentalFee: 5000.0 },
      ],
      status: 'available',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T12:00:00Z',
    },
    {
      id: 2,
      title: 'Manila Bay Dreams',
      artist: { id: 2, name: 'Maria Santos' },
      description:
        'An abstract representation of the bustling life around Manila Bay.',
      medium: 'acrylic on canvas',
      heightCm: 90,
      widthCm: 60,
      images: [
        {
          id: 2,
          isPrimary: true,
          imageUrl:
            'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-3x2.png',
        },
        {
          id: 17,
          isPrimary: false,
          imageUrl:
            'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-3x2.png',
        },
        {
          id: 18,
          isPrimary: false,
          imageUrl:
            'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-3x2.png',
        },
      ],
      tags: ['manila', 'bay', 'abstract', 'citylife'],
      style: 'abstract',
      rentalPlans: [
        { durationMonths: 3, rentalFee: 2000.0 },
        { durationMonths: 6, rentalFee: 3700.0 },
        { durationMonths: 12, rentalFee: 6800.0 },
      ],
      status: 'available',
      createdAt: '2024-02-01T14:30:00Z',
      updatedAt: '2024-02-05T16:45:00Z',
    },
    {
      id: 3,
      title: 'Banaue Rice Terraces',
      artist: { id: 3, name: 'Roberto Villanueva' },
      description:
        'A detailed landscape painting of the iconic Banaue Rice Terraces.',
      medium: 'watercolor',
      heightCm: 60,
      widthCm: 120,
      images: [
        {
          id: 3,
          isPrimary: true,
          imageUrl:
            'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-2x1.png',
        },
      ],
      tags: ['banaue', 'rice terraces', 'landscape', 'heritage'],
      style: 'realism',
      rentalPlans: [
        { durationMonths: 3, rentalFee: 1200.0 },
        { durationMonths: 6, rentalFee: 2200.0 },
        { durationMonths: 12, rentalFee: 4000.0 },
      ],
      status: 'available',
      createdAt: '2024-02-10T09:15:00Z',
      updatedAt: '2024-02-12T11:20:00Z',
    },
  ];

  // TODO: Replace with real data
  const recommended_artworks = [
    {
      id: 4,
      title: 'Urban Rhythm',
      artist: { id: 4, name: 'Carlos Mendoza' },
      description:
        'A contemporary piece capturing the energy of modern Filipino street life.',
      medium: 'mixed media',
      heightCm: 100,
      widthCm: 80,
      images: [
        {
          id: 4,
          isPrimary: true,
          imageUrl:
            'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-4x5.png',
        },
        {
          id: 19,
          isPrimary: false,
          imageUrl:
            'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-4x5.png',
        },
      ],
      tags: ['urban', 'contemporary', 'street', 'modern'],
      style: 'contemporary',
      rentalPlans: [
        { durationMonths: 3, rentalFee: 2500.0 },
        { durationMonths: 6, rentalFee: 4600.0 },
        { durationMonths: 12, rentalFee: 8500.0 },
      ],
      status: 'available',
      createdAt: '2024-02-18T13:45:00Z',
      updatedAt: '2024-02-20T15:10:00Z',
    },
    {
      id: 5,
      title: "Fisherman's Dawn",
      artist: { id: 5, name: 'Ana Reyes' },
      description:
        'A serene portrayal of fishermen preparing their nets at dawn.',
      medium: 'oil on canvas',
      heightCm: 50,
      widthCm: 70,
      images: [
        {
          id: 5,
          isPrimary: true,
          imageUrl:
            'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-7x5.png',
        },
      ],
      tags: ['fisherman', 'dawn', 'sea', 'traditional'],
      style: 'realism',
      rentalPlans: [
        { durationMonths: 3, rentalFee: 1800.0 },
        { durationMonths: 6, rentalFee: 3300.0 },
        { durationMonths: 12, rentalFee: 6000.0 },
      ],
      status: 'available',
      createdAt: '2024-02-25T08:20:00Z',
      updatedAt: '2024-02-28T10:35:00Z',
    },
    {
      id: 6,
      title: 'Tropical Monsoon',
      artist: { id: 6, name: 'Luis Garcia' },
      description:
        'An expressive painting depicting the power and beauty of tropical storms.',
      medium: 'acrylic on canvas',
      heightCm: 120,
      widthCm: 90,
      images: [
        {
          id: 6,
          isPrimary: true,
          imageUrl:
            'https://unlimitedworks.blob.core.windows.net/up-cebu-exchange/placeholder-img-3x4.png',
        },
      ],
      tags: ['monsoon', 'tropical', 'storm', 'nature'],
      style: 'expressionism',
      rentalPlans: [
        { durationMonths: 3, rentalFee: 2200.0 },
        { durationMonths: 6, rentalFee: 4000.0 },
        { durationMonths: 12, rentalFee: 7300.0 },
      ],
      status: 'available',
      createdAt: '2024-03-05T16:00:00Z',
      updatedAt: '2024-03-08T12:15:00Z',
    },
  ];

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
          <button className="bg-secondary text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Explore Paintings
          </button>
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
        <div
          style={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))',
          }}
        >
          {recommended_artworks.map((a) => (
            <ArtworkCard key={a.id} artwork={a} />
          ))}
        </div>
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

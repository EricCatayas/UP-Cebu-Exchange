import Image from 'next/image';
import Link from 'next/link';
export default function Themes() {
  return (
    <div className="container px-8 py-6 max-w-7xl mx-auto">
      <section>
        {/* Home Header Section */}
        <h1 className="font-lora font-medium text-8xl mb-4 w-fit leading-tight text-primary">
          Discover Art
          <br />
          from UP Cebu
        </h1>
        <h1 className="font-lora font-medium text-8xl mb-4 w-fit leading-tight bg-gradient-to-br from-[#d50007] to-[#e5ca48] bg-clip-text text-transparent">
          Discover Art
          <br />
          from UP Cebu
        </h1>
        <h1 className="font-lora font-medium text-8xl mb-4 w-fit leading-tight bg-gradient-to-br from-[#a70006] to-[#ffb224] bg-clip-text text-transparent">
          Discover Art
          <br />
          from UP Cebu
        </h1>
        <h1 className="font-lora font-medium text-8xl mb-4 w-fit leading-tight bg-gradient-to-tr from-[#e53e44] to-[#e5ca48] bg-clip-text text-transparent animate-slidein opacity-0 [--slide-delay:300ms]">
          Discover Art
          <br />
          from UP Cebu
        </h1>
        <h1 className="font-lora font-medium italic text-8xl mb-4 w-fit leading-tight">
          Discover Art
          <br />
          from UP Cebu
        </h1>
        <h1 className="font-lora font-semibold italic text-8xl mb-4 w-fit leading-tight">
          Discover Art
          <br />
          from UP Cebu
        </h1>
      </section>
      <section>
        {/* Navbar */}
        <div className="flex items-center space-x-4">
          <h1 className="font-lora text-3xl font-bold text-primary">UP Cebu Exchange</h1>
        </div>
        <div className="flex items-center space-x-4">
          <h1 className="font-lora text-3xl font-bold bg-gradient-to-r from-[#8E1537] to-[#e5ca48] bg-clip-text text-transparent">
            UP Cebu Exchange
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <h1 className="font-lora text-3xl font-bold bg-gradient-to-r from-[#a70006] to-[#ffb224] bg-clip-text text-transparent">
            UP Cebu Exchange
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <h1 className="font-lora text-3xl font-bold">
            <span className="text-primary">UP</span> <span className="text-tertiary">Cebu</span>{' '}
            <span className="text-secondary">Exchange</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <h1 className="font-lora text-3xl font-bold">
            <span className="text-primary">UP</span> <span className="text-secondary">Cebu</span>{' '}
            <span className="text-tertiary">Exchange</span>
          </h1>
        </div>
      </section>
      <section className="mb-6">
        <h2 className="text-3xl font-bold">A Few of our Favorites</h2>
        <h2 className="text-3xl font-bold text-primary">A Few of our Favorites</h2>
        <h2 className="text-3xl font-bold bg-gradient-to-br from-[#a70006] to-[#ffb224] bg-clip-text text-transparent">
          A Few of our Favorites
        </h2>
      </section>
      <section className="mb-6">
        <Link href="/artworks" className="bg-primary text-white px-8 py-3 rounded-full font-semibold transition-colors">
          Explore Paintings
        </Link>
        <Link
          href="/artworks"
          className="bg-gradient-to-br from-[#d50007] to-[#e5ca48] text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Explore Paintings
        </Link>
        <Link
          href="/artworks"
          className="bg-gradient-to-br from-[#a70006] to-[#ffb224] text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Explore Paintings
        </Link>
        <Link
          href="/artworks"
          className="bg-gradient-to-r from-[#a70006] to-[#ffb224] text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Explore Paintings
        </Link>
      </section>
      <section className="relative min-h-[200px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/jose-joya.png" alt="Header image background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-white/20" />
        </div>
        <h1
          className="relative z-10 text-6xl font-lora font-bold italic text-white text-center"
          style={{ WebkitTextStroke: '2px #FF6F00' }}
        >
          All Artworks
        </h1>
      </section>
      <section className="relative min-h-[200px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/jose-joya.png" alt="Header image background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-white/20" />
        </div>
        <h1 className="relative z-10 text-6xl font-lora font-bold italic text-white text-center">All Artworks</h1>
      </section>
      <section className="mb-6">
        <h1 className="text-6xl font-light">Geist Light</h1>
        <h1 className="text-6xl font-regular">Geist Regular</h1>
        <h1 className="text-6xl font-semibold">Geist Semibold</h1>
        <h1 className="text-6xl font-bold">Geist Bold</h1>

        <h1 className="text-6xl font-lora font-regular">Lora Regular</h1>
        <h1 className="text-6xl font-lora font-regular italic">Lora Italic</h1>
        <h1 className="text-6xl font-lora font-medium">Lora Medium</h1>
        <h1 className="text-6xl font-lora font-medium italic">Lora Medium Italic</h1>
        <h1 className="text-6xl font-lora font-semibold">Lora SemiBold</h1>
        <h1 className="text-6xl font-lora font-semibold italic">Lora SemiBold Italic</h1>
        <h1 className="text-6xl font-lora font-bold">Lora Bold</h1>
        <h1 className="text-6xl font-lora font-bold italic">Lora Bold Italic</h1>
      </section>
    </div>
  );
}

import ArtworkCard from '@/components/ArtworkCard/ArtworkCard';
import ArtworkService from '@/services/ArtworkService';

const EmailNewsletter = async () => {
  const artworkService = new ArtworkService();
  const randomArtworks = await artworkService.getRandomArtworks(1);
  const artwork = randomArtworks[0];

  return (
    <div className="py-12 bg-top lg:bg-center" style={{ backgroundImage: `url('/images/newsletter-bg.jpg')`, backgroundSize: 'cover' }}>
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl min-h-[500px] md:min-h-[600px]">
        <div className="rounded-lg p-6 md:p-12 lg:p-16 flex flex-col-reverse md:flex-row items-stretch gap-6">
          {/* Left column */}
          <div className="md:w-1/2">
            <h2 className="font-lora font-medium text-4xl sm:text-5xl md:text-6xl leading-tight bg-gradient-to-tr from-[#e53e44] to-[#e5ca48] bg-clip-text text-transparent">
              Bring Art
              <br />
              to Your Space
            </h2>
            <p className="text-gray-700 mt-4">
              Receive updates on the latest artwork rentals perfect for business displays, events, and creative
              spaces. Sign up to discover new collections from UP Cebu’s emerging artists.
            </p>

            <form action="#" method="post" className="mt-6 flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary flex-1"
              />
              <button
                type="submit"
                className="btn bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-md font-semibold transition-colors w-auto self-start"
              >
                Subscribe
              </button>
            </form>

          </div>
          {/* Right column */}
          <div className="flex flex-col items-center gap-4">
              {artwork ? (
                <div className="max-w-56">
                  <ArtworkCard artwork={artwork} classes="shadow" displayInfo={false} displayCartWishlist={false} />
                </div>
              ) : (
                <div className="w-full max-w-xs h-56 bg-gray-200 rounded" />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailNewsletter;
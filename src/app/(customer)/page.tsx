export default function Page() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        UP Cebu Exchange
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
        Welcome to the University of the Philippines Cebu Art Exchange platform.
      </p>
      <div className="flex justify-center mt-8">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          Explore Artworks
        </button>
      </div>
    </div>
  );
}

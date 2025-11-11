"use client";
import React from "react";
const ArtworkGallery = ({ artwork }: { artwork: any }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(
    artwork.images?.findIndex((img) => img.isPrimary) || 0
  );

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : artwork.images.length - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev < artwork.images.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div>
      {/* Main Image */}
      <div className="bg-gray-100 mb-4 rounded-lg overflow-hidden">
        <img
          src={artwork.images[currentImageIndex]?.imageUrl}
          alt={artwork.title}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="Previous image"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex gap-2 overflow-x-auto flex-1">
          {artwork.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                currentImageIndex === index
                  ? "border-blue-500"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <img
                src={image.imageUrl}
                alt={`${artwork.title} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="Next image"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ArtworkGallery;

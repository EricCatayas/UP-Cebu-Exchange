'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
const slides = [
  {
    id: 1,
    title: 'Jose T. Joya Gallery',
    image: '/images/visit-us-1.png',
  },
  {
    id: 2,
    title: 'UP Cebu Museum of Art and Culture',
    image: '/images/visit-us-2.png',
  },
];

export default function VisitUs() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Auto transition every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Reset fade state shortly after slide changes to allow fade-in
  useEffect(() => {
    const timeout = setTimeout(() => setIsFading(false), 50);
    return () => clearTimeout(timeout);
  }, [currentSlide]);

  const goToPrevious = () => {
    setIsFading(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setIsFading(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setIsFading(true);
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Background Image */}
      <div
        className={`absolute inset-0 z-0 w-full h-full transition-opacity duration-1000 ease-out ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image src={slide.image} alt={slide.title} fill className="object-cover w-full h-auto" priority />
      </div>

      {/* Content anchored near bottom-right with breathing room */}
      <div className="absolute bottom-12 right-12 z-10 w-[26rem] h-[10rem] flex items-center justify-center">
        <div className="container bg-black bg-opacity-50 text-white flex flex-col items-center justify-center w-full h-full">
          <h2 className="font-playfair text-3xl font-light text-center">{slide.title}</h2>
          <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors">
            See Our Location
          </button>
        </div>
      </div>
      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={32} />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <FaChevronRight size={32} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

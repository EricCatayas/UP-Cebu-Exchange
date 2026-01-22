'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SliderImage {
  id: number;
  url: string;
  title: string;
  subtitle: string;
  buttonText: string;
  onClick: () => void;
}

interface SliderProps {
  images: Array<SliderImage>;
}

export default function Slider({ images }: SliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <div className="flex gap-2 h-[500px] md:h-[600px] overflow-hidden">
        {images.map((image, index) => (
          <div
            key={image.id}
            onClick={() => setActiveIndex(index)}
            className={`relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ease-in-out group ${
              activeIndex === index ? 'flex-[5]' : 'flex-[1]'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority={index === 0}
              />
              {/* Overlay gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 ${
                  activeIndex === index ? 'opacity-60' : 'opacity-90'
                }`}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
              {/* Collapsed state - vertical text */}
              <div
                className={`transition-opacity duration-500 ${
                  activeIndex === index ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              ></div>

              {/* Expanded state - horizontal text */}
              <div
                className={`absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 transition-all duration-700 ${
                  activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <p className="text-gray-300 text-sm md:text-base mb-2 uppercase tracking-wider">{image.subtitle}</p>
                <h2 className="text-white font-bold text-3xl md:text-5xl mb-4 leading-tight">{image.title}</h2>
                <button
                  onClick={() => image.onClick()}
                  className="px-6 py-3 bg-white text-black font-semibold rounded-lg transition-all duration-300 hover:bg-gray-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  {image.buttonText}
                </button>
              </div>

              {/* Hover indicator for collapsed slides */}
              {activeIndex !== index && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`transition-all duration-300 ${
              activeIndex === index
                ? 'w-12 h-3 bg-gray-300 rounded-full'
                : 'w-3 h-3 bg-gray-600 rounded-full hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

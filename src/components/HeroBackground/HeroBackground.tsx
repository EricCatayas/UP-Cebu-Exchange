import React from 'react';
import Image from 'next/image';

export default function HeroBackground({
  backgroundImage = '/images/landing-page-bg.png',
  children,
}: {
  backgroundImage?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={backgroundImage} alt="Landing Page Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-white/40" />
      </div>
      <div className="relative z-10 w-full pb-10 sm:pb-5 md:pb-0">{children}</div>
    </section>
  );
}

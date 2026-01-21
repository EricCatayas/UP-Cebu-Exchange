import Image from 'next/image';
import Link from 'next/link';

function PageHeader({
  title,
  imageUrl,
  minHeight = '200px',
  overlay = true,
}: {
  title: string;
  imageUrl?: string;
  minHeight?: string;
  overlay?: boolean;
}) {
  return (
    <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight }}>
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl ?? '/images/jose-joya.png'}
          alt="Header image background"
          fill
          className="object-cover"
          priority
        />
        {overlay && <div className="absolute inset-0 bg-white/20" />}
      </div>
      <h1
        className="relative z-10 text-6xl font-lora font-bold italic text-white text-center"
        // style={{ WebkitTextStroke: '2px #FF6F00' }}
      >
        {title}
      </h1>
    </section>
  );
}

export default PageHeader;

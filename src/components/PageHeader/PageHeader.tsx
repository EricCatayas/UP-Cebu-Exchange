import Image from 'next/image';
import Link from 'next/link';

function PageHeader({ title }: { title: string }) {
  return (
    <section className="relative min-h-[200px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/images/jose-joya.png" alt="Header image background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-white/20" />
      </div>
      <h1
        className="relative z-10 text-6xl font-lora font-bold italic text-white text-center"
        // todo: substitute with tailwind config color
        style={{ WebkitTextStroke: '2px #FF6F00' }}
      >
        {title}
      </h1>
    </section>
  );
}

export default PageHeader;

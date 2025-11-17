import Image from 'next/image';
import Link from 'next/link';

function PageHeader({ title }: { title: string }) {
  return (
    <section className="relative min-h-[200px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/Jose Joya.png" alt="Header image background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-white/40" />
      </div>
      <h1 className="relative z-10 text-4xl font-poppins font-semibold text-center">{title}</h1>
    </section>
  );
}

export default PageHeader;

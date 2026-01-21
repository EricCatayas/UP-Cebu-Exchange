import HeroBackground from '@/components/HeroBackground/HeroBackground';
import Slider from '@/components/Slider/Slider';
import { FaGithub, FaFacebook } from 'react-icons/fa';
export default function Page() {
  const locations = {
    office: {
      title: 'UP Cebu Business Incubator for Information Technology (inIT)',
      address:
        'University Of The Philippines, Arts & Sciences Building, 3rd Floor, Left Wing, Gorordo Ave, Cebu City, 6000 Cebu',
      link: 'https://maps.app.goo.gl/HMSn61QwycCWDGhRA',
      imageUrl: '/images/gallery-3.jpg',
    },
    museum: {
      title: 'University of the Philippines Museum of Art & Culture',
      address: 'UP Administration Building, Cebu City, 6000 Cebu',
      link: 'https://maps.app.goo.gl/7FshmWfDCjuffdqT8',
      imageUrl: '/images/gallery-2.jpg',
    },
    gallery: {
      title: 'Jose Joya Art Gallery',
      address: 'UP Undergraduate Building, Cebu City, 6000 Cebu',
      link: 'https://maps.app.goo.gl/MyvSedkKAboKXdYF8',
      imageUrl: '/images/gallery-1.jpg',
    },
  };

  const images = [
    {
      id: 1,
      url: '/images/temp3.jpg',
      title: 'Workshop',
      subtitle: 'Events',
    },
    {
      id: 2,
      url: '/images/temp2.jpg',
      title: 'Museum of Art',
      subtitle: 'Cultural Heritage',
    },
    {
      id: 3,
      url: '/images/temp1.jpg',
      title: 'Visit Us',
      subtitle: 'Campus Experience',
    },
    {
      id: 4,
      url: '/images/temp4.jpg',
      title: 'Visit Us',
      subtitle: 'Campus Experience',
    },
  ];
  // TODO: About Us
  const team = [
    {
      name: 'Eric Jay Catayas',
      role: 'Full Stack Developer',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763972672/UP%20Cebu%20Exchange/placeholder-img-1x1_ihvqvy.png',
      github: 'https://github.com/EricCatayas',
    },
    {
      name: 'Dexter Duane Sebes',
      role: 'Frontend Developer',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763972672/UP%20Cebu%20Exchange/placeholder-img-1x1_ihvqvy.png',
      github: 'https://github.com/ShanVich',
    },
    {
      name: 'Jomar Baculi',
      role: 'Database Administrator',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763972672/UP%20Cebu%20Exchange/placeholder-img-1x1_ihvqvy.png',
      github: 'https://github.com/hubGitjomar',
    },
    {
      name: 'Joselito Lucabon Jr.',
      role: 'UI/UX Designer',
      imageUrl:
        'https://res.cloudinary.com/dbgolykzg/image/upload/v1763972672/UP%20Cebu%20Exchange/placeholder-img-1x1_ihvqvy.png',
      github: 'https://github.com/Baderp1',
    },
  ];
  return (
    <>
      <HeroBackground backgroundImage="/images/gallery-3.jpg">
        <div className="container mx-auto pl-24 text-left">
          <h1 className="font-lora font-medium text-8xl mb-4 w-fit leading-tight text-primary slide-right-delay-400">
            About Us
          </h1>
          <div className="bg-black/30 backdrop-blur-sm p-6 max-w-2xl">
            <p className="font-lora font-bold text-white text-lg md:text-xl slide-right-delay-600">
              UP Cebu Exchange is a platform that showcases and supports artworks crafted by student Filipino artists
              from the University of the Philippines Cebu. We provide a space where students can share their creative
              narratives, develop their artistic identity, and make their works more accessible through an art rental
              experience. Through UP Cebu Exchange, we aim to foster sustainability, creativity, and meaningful
              engagement between artists and the community.
            </p>
          </div>
        </div>
      </HeroBackground>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700">
              Our mission is to connect students with people who want to buy or rent unique, student-made products and
              artworks. From handmade items to original designs, we give young creators a space to share their work,
              earn from their skills, and reach a wider audience.
            </p>
          </section>
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700">
              We envision a vibrant and dynamic exchange platform that empowers students and faculty to easily trade
              goods and services, enhancing campus life and promoting sustainability through reuse and recycling.
            </p>
          </section>
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Visit Our Store</h2>
            <div className="flex gap-8 items-start mb-4">
              <p className="text-lg text-gray-700 flex-1">
                You can visit us at the UP Cebu Business Incubator for Information Technology (inIT) located at the
                {locations.office.address}. We are open from Monday to Friday, 9:00 AM to 5:00 PM. Feel free to drop by
                and explore our collection of student-made artworks!
              </p>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d488.8298232100851!2d123.89924642239608!3d10.323536688458992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999a963982bd1%3A0x11c2f0cefd67f0b2!2sUP%20Cebu%20Business%20Incubator%20for%20Information%20Technology%20(inIT)!5e0!3m2!1sen!2sph!4v1768976953961!5m2!1sen!2sph"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <Slider images={images} />
          </section>
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Our Team</h2>
            <div className="grid grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="flex flex-col items-center text-center">
                  <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                    <img src={member.imageUrl} alt={member.name} className="object-cover" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{member.role}</p>
                  <h3 className="font-semibold mb-2">{member.name}</h3>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    <FaGithub className="inline mr-1" />
                    <FaFacebook className="inline" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

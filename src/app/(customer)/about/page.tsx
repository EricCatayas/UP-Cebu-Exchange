import PageHeader from '@/components/PageHeader/PageHeader';
import { FaGithub, FaFacebook } from 'react-icons/fa';
export default function Page() {
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
    <div>
      <PageHeader title="About Us" />
      <div className="container px-8 py-6 max-w-6xl mx-auto">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700">
            Our mission is to connect students with people who want to buy or rent unique, student-made products and
            artworks. From handmade items to original designs, we give young creators a space to share their work, earn
            from their skills, and reach a wider audience.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg text-gray-700">
            We envision a vibrant and dynamic exchange platform that empowers students and faculty to easily trade goods
            and services, enhancing campus life and promoting sustainability through reuse and recycling.
          </p>
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
  );
}

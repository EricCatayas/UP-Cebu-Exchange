import React from 'react';
import { FaGithub, FaFacebook } from 'react-icons/fa';

const DevTeamPage = () => {
  const devs = [
    { name: 'Eric Jay Catayas', role: 'Full Stack Developer', info: 'Description ni Eric yeeeeee', fb: '#', gh: '#' },
    { name: 'Dexter Duane Sebes', role: 'Frontend Developer', info: 'Description ni Dexter yeeeeee', fb: '#', gh: '#' },
    { name: 'Jomar Baculi', role: 'Database Administrator', info: 'Description ni Jomar yeeeeee', fb: '#', gh: '#' },
    { name: 'Joselito Lucabon Jr.', role: 'UI/UX Designer', info: 'Description ni Joselito yeeeeee', fb: '#', gh: '#' },
  ];

  return (
    <div className="min-h-screen bg-white text-primary">
      <header className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full -z-10" />

        <h2 className="text-black font-lora text-sm tracking-[0.3em] uppercase mb-4">The Builders</h2>
        <h1 className="text-5xl md:text-7xl font-extrabold font-lora tracking-tight mb-6">
          Meet the{' '}
          <span className="font-lora text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Dev Team
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl leading-relaxed">
          The developers, dreamers, and coffee-fueled programmers turning complex challenges into elegant digital
          experiences.
        </p>
      </header>

      <main className="max-w-8xl mx-auto px-6 pb-24">
        <div className="flex flex-col md:flex-row w-full h-[600px] gap-4">
          {devs.map((dev, index) => (
            <div
              key={index}
              className="group relative flex-[1] hover:flex-[3] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden bg-slate-900 rounded-3xl border border-white/5"
            >
              <img
                src={`https://res.cloudinary.com/dbgolykzg/image/upload/v1763972672/UP%20Cebu%20Exchange/placeholder-img-1x1_ihvqvy.png`}
                alt={dev.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10">
                <h3 className="text-white font-bold text-2xl">{dev.name}</h3>
                <p className="text-blue-400 font-medium text-sm tracking-wide">{dev.role}</p>
              </div>

              <div className="absolute inset-y-0 right-0 w-[50%] bg-slate-950/80 backdrop-blur-xl p-10 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 z-20">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-tighter text-blue-500 font-bold mb-2">Info</h4>
                    <p className="text-gray-200 text-lg leading-snug">{dev.info}</p>
                  </div>

                  <div className="flex gap-3">
                    <a href={dev.gh} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                      <FaGithub size={20} />
                    </a>
                    <a href={dev.fb} className="p-3 bg-white/5 hover:bg-blue-600/20 rounded-xl transition-all">
                      <FaFacebook size={20} className="group-hover:text-blue-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DevTeamPage;

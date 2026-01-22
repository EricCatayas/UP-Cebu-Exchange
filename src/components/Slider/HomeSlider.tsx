'use client';
import Slider from './Slider';

export default function HomeSlider() {
  const images = [
    {
      id: 1,
      url: '/images/gallery-1.jpg',
      title: 'Jose T. Joya Gallery',
      subtitle: 'Contemporary Art',
      buttonText: 'See Location',
      onClick: () => window.open('https://maps.app.goo.gl/MyvSedkKAboKXdYF8', '_blank'),
    },
    {
      id: 2,
      url: '/images/gallery-2.jpg',
      title: 'Museum of Art',
      subtitle: 'Cultural Heritage',
      buttonText: 'See Location',
      onClick: () => window.open('https://maps.app.goo.gl/7FshmWfDCjuffdqT8', '_blank'),
    },
    {
      id: 3,
      url: '/images/gallery-3.jpg',
      title: 'Visit Us',
      subtitle: 'Campus Experience',
      buttonText: 'Learn More',
      onClick: () => (window.location.href = '/about'),
    },
  ];

  return <Slider images={images} />;
}

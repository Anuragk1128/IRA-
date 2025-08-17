"use client"

import { useEffect, useState } from 'react';

const heroImages = [
  {
    src: "/hero.jpg",
    alt: "Elegant jewelry collection",
    position: "center 70%"
  },
  {
    src: "/hero2.jpeg",
    alt: "Elegant gold necklace",
    position: "center 60%"
  },
  {
    src: "/hero3.jpeg",
    alt: "Elegant gold rings",
    position: "center 50%"
  },
  {
    src: "/hero4.jpeg",
    alt: "Elegant gold bracelets",
    position: "center 60%"
  }
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 500); // Half of the transition duration
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen max-h-[120vh] overflow-hidden">
      <div className="relative w-full h-full">
        {heroImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              style={{
                objectPosition: image.position,
                width: '100%',
                height: '100%',
              }}
              loading={index === 0 ? 'eager' : 'lazy'}
              width={1920}
              height={2560}
              sizes="100vw"
            />
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
              aria-hidden="true"
            />
          </div>
        ))}
        
        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75 w-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

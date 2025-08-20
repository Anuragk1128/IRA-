"use client"

import { useEffect, useRef, useState } from 'react';

const heroImages = [
  {
    src: "/iramodel1.JPG",
    alt: "Elegant jewelry collection",
    position: "center 70%"
  },
  {
    src: "/iramodel2.JPG",
    alt: "Elegant gold necklace",
    position: "center 60%"
  },
  {
    src: "/iramodel3.png",
    alt: "Elegant gold rings",
    position: "center 50%"
  },
  {
    src: "/iramodel4.JPG",
    alt: "Elegant gold bracelets",
    position: "center 60%"
  }
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchMoveX, setTouchMoveX] = useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);
  const [mouseMoveX, setMouseMoveX] = useState<number | null>(null);

  // Refs for timers and video
  const intervalRef = useRef<number | null>(null);

  // Helper to clear interval safely
  const clearSlideInterval = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Auto-advance behavior for images: advance every 5s
  useEffect(() => {
    clearSlideInterval();
    // Image: auto-advance on interval
    intervalRef.current = window.setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearSlideInterval();
  }, [currentImageIndex]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchMoveX(null);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchMoveX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchMoveX === null) return;
    const deltaX = touchMoveX - touchStartX;
    const threshold = 50; // px to trigger swipe
    if (Math.abs(deltaX) > threshold) {
      setCurrentImageIndex((prev) => {
        if (deltaX < 0) {
          // swipe left -> next
          return prev === heroImages.length - 1 ? 0 : prev + 1;
        } else {
          // swipe right -> prev
          return prev === 0 ? heroImages.length - 1 : prev - 1;
        }
      });
    }
    setTouchStartX(null);
    setTouchMoveX(null);
  };

  // Desktop mouse drag swipe
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseStartX(e.clientX);
    setMouseMoveX(null);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseStartX !== null) {
      setMouseMoveX(e.clientX);
    }
  };
  const handleMouseUp = () => {
    if (mouseStartX === null || mouseMoveX === null) return setMouseStartX(null);
    const deltaX = mouseMoveX - mouseStartX;
    const threshold = 50;
    if (Math.abs(deltaX) > threshold) {
      setCurrentImageIndex((prev) => {
        if (deltaX < 0) return prev === heroImages.length - 1 ? 0 : prev + 1;
        return prev === 0 ? heroImages.length - 1 : prev - 1;
      });
    }
    setMouseStartX(null);
    setMouseMoveX(null);
  };

  return (
    <section className="relative w-full h-screen max-h-[120vh] overflow-hidden">
      <div
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {heroImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={(image as any).src}
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

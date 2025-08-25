"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const heroImages = [
  {
    src: "iramodel1.JPG",
    alt: "Elegant layered gold jewelry collection",
    position: "center 4%",
  },
  {
    src: "iramodel2.JPG",
    alt: "Statement circular disc necklace",
    position: "center 8%",
  },
  {
    src: "iramodel3.png",
    alt: "Delicate crystal teardrop pendant",
    position: "center center",
  },
  {
    src: "iramodel5.jpg",
    alt: "Jewelry collection showcase",
    position: "center center",
  },
]

export function HeroSection() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
    skipSnaps: false,
  })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((idx: number) => emblaApi && emblaApi.scrollTo(idx), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  // Autoplay (no external plugin needed)
  useEffect(() => {
    if (!emblaApi) return
    const id = window.setInterval(() => {
      if (!paused) emblaApi.scrollNext()
    }, 5000)
    return () => window.clearInterval(id)
  }, [emblaApi, paused])

  return (
    <section className="relative w-full pt-2 lg:pt-2 md:pt-2 pb-6 lg:pb-6 md:pb-10">
      <div className="mx-auto max-w-[1570px] px-2">
        {/* Viewport */}
        <div
          className="relative overflow-hidden"
          ref={emblaRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Container */}
          <div className="flex -ml-4">
            {heroImages.map((image, index) => {
              const isActive = index === selectedIndex
              return (
                <div key={index} className="pl-4 shrink-0 basis-[88%] sm:basis-[75%] md:basis-[65%] lg:basis-[58%]">
                  <div
                    className={`relative h-[240px] sm:h-[320px] md:h-[380px] lg:h-[460px] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5 transition-all duration-500 ${
                      isActive ? "scale-100 opacity-100" : "scale-[0.95] opacity-80"
                    }`}
                  >
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: image.position }}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    {/* Optional gradient overlays for text legibility */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={scrollPrev}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md ring-1 ring-black/10 hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={scrollNext}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md ring-1 ring-black/10 hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === selectedIndex ? "w-8 bg-neutral-800" : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

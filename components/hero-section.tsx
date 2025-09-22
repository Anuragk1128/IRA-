"use client"

import type React from "react"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const heroImages = [
  {
    src: "https://res.cloudinary.com/deamrxfwp/image/upload/v1758540858/ira_3x2_s4xw9v.jpg",
    alt: "Elegant layered gold jewellery collection",
    position: "center 4%",
  },
  {
    src: "https://res.cloudinary.com/deamrxfwp/image/upload/v1758540924/ira_post_o2rllz.jpg",
    alt: "Statement circular disc necklace",
    position: "center center",
  },
  {
    src: "https://res.cloudinary.com/deamrxfwp/image/upload/v1758540980/iramodel3_xm47ch.png",
    alt: "Delicate crystal teardrop pendant",
    position: "center center",
  },
  {
    src: "https://res.cloudinary.com/deamrxfwp/image/upload/v1758543376/iramodel5_wjqs5d.jpg",
    alt: "jewellery collection showcase",
    position: "center center",
  },
  {
    src: "https://res.cloudinary.com/deamrxfwp/image/upload/v1758543423/iramodel4_cfukpf.jpg",
    alt: "jewellery collection showcase",
    position: "center center",
  }
]

export function HeroSection() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const slideRefs = useRef<HTMLDivElement[]>([])
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

  // GSAP animations: scoped and SSR-safe
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!rootRef.current) return

    const ctx = gsap.context(() => {
      // Prepare
      gsap.set(slideRefs.current, { opacity: 0, y: 20, willChange: "transform, opacity" })

      // Slide-in on scroll for each card
      slideRefs.current.forEach((el) => {
        if (!el) return
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      })

      // Subtle entrance for arrows and dots
      const controls = gsap.utils.toArray<HTMLElement>([".hero-arrow-left", ".hero-arrow-right", ".hero-dots"])
      gsap.fromTo(
        controls,
        { autoAlpha: 0, y: -6 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06 }
      )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative w-full pt-2 lg:pt-2 md:pt-2 pb-6 lg:pb-6 md:pb-10">
      <div className="mx-auto max-w-[1570px] px-2" ref={rootRef}>
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
                <div key={index} className="pl-1 shrink-0 basis-[88%] sm:basis-[75%] md:basis-[65%] lg:basis-[58%]">
                  <div
                    className={`relative h-[45vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh] 2xl:h-[60vh] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5 transition-all duration-500 ${
                      isActive ? "scale-100 opacity-100" : "scale-[0.95] opacity-80"
                    }`}
                    ref={(el) => {
                      if (el) slideRefs.current[index] = el
                    }}
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
          className="hero-arrow-left absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md ring-1 ring-black/10 hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={scrollNext}
          aria-label="Next slide"
          className="hero-arrow-right absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md ring-1 ring-black/10 hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Dots */}
        <div className="hero-dots mt-6 flex items-center justify-center gap-2">
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

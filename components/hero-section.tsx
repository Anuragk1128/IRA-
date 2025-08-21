"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

const heroImages = [
  {
    src: "iramodel1.JPG",
    alt: "Elegant layered gold jewelry collection",
    position: "center 30%",
  },
  {
    src: "iramodel2.JPG",
    alt: "Statement circular disc necklace",
    position: "center 20%",
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchMoveX, setTouchMoveX] = useState<number | null>(null)
  const [mouseStartX, setMouseStartX] = useState<number | null>(null)
  const [mouseMoveX, setMouseMoveX] = useState<number | null>(null)
  const [showSideBars, setShowSideBars] = useState(false)

  // Container to compute aspect ratio and detect letterboxing
  const containerRef = useRef<HTMLDivElement | null>(null)
  // Cache natural sizes so we can recompute without relying on onLoad
  const imageSizesRef = useRef<Record<number, { w: number; h: number }>>({})

  // Determine if side bars (left/right) will appear due to object-contain on wide screens
  const computeLetterbox = (imgWidth?: number, imgHeight?: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const containerAR = rect.width / rect.height
    let imageAR: number | null = null
    if (imgWidth && imgHeight) {
      imageAR = imgWidth / imgHeight
    }
    // If we don't have image AR from onLoad, bail until we do
    if (!imageAR) return

    // If image AR is smaller than container AR, vertical bars appear (left/right)
    const hasSideBars = imageAR < containerAR
    setShowSideBars(hasSideBars)
  }

  // Recompute on resize using cached natural size for current slide
  useEffect(() => {
    const onResize = () => {
      const size = imageSizesRef.current[currentImageIndex]
      if (size) computeLetterbox(size.w, size.h)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [currentImageIndex])

  // Recompute when current slide changes
  useEffect(() => {
    const size = imageSizesRef.current[currentImageIndex]
    if (size) computeLetterbox(size.w, size.h)
    else setShowSideBars(false)
  }, [currentImageIndex])

  // Refs for timers and video
  const intervalRef = useRef<number | null>(null)

  // Helper to clear interval safely
  const clearSlideInterval = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Auto-advance behavior for images: advance every 5s
  useEffect(() => {
    clearSlideInterval()
    // Image: auto-advance on interval
    intervalRef.current = window.setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1))
        setIsTransitioning(false)
      }, 500)
    }, 5000)
    return () => clearSlideInterval()
  }, [currentImageIndex])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchMoveX(null)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchMoveX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX === null || touchMoveX === null) return
    const deltaX = touchMoveX - touchStartX
    const threshold = 50 // px to trigger swipe
    if (Math.abs(deltaX) > threshold) {
      setCurrentImageIndex((prev) => {
        if (deltaX < 0) {
          // swipe left -> next
          return prev === heroImages.length - 1 ? 0 : prev + 1
        } else {
          // swipe right -> prev
          return prev === 0 ? heroImages.length - 1 : prev - 1
        }
      })
    }
    setTouchStartX(null)
    setTouchMoveX(null)
  }

  // Desktop mouse drag swipe
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseStartX(e.clientX)
    setMouseMoveX(null)
  }
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseStartX !== null) {
      setMouseMoveX(e.clientX)
    }
  }
  const handleMouseUp = () => {
    if (mouseStartX === null || mouseMoveX === null) return setMouseStartX(null)
    const deltaX = mouseMoveX - mouseStartX
    const threshold = 50
    if (Math.abs(deltaX) > threshold) {
      setCurrentImageIndex((prev) => {
        if (deltaX < 0) return prev === heroImages.length - 1 ? 0 : prev + 1
        return prev === 0 ? heroImages.length - 1 : prev - 1
      })
    }
    setMouseStartX(null)
    setMouseMoveX(null)
  }

  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[100vh] overflow-hidden">
      <div
        className="relative w-full h-full"
        ref={containerRef}
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
              index === currentImageIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover lg:object-contain object-center transition-transform duration-700 hover:scale-105"
                style={{
                  objectPosition: image.position,
                }}
                onLoad={(e) => {
                  // Only compute for the currently visible slide to avoid flicker
                  if (index !== currentImageIndex) {
                    // Still cache size for later use
                    const t = e.currentTarget as HTMLImageElement
                    imageSizesRef.current[index] = { w: t.naturalWidth, h: t.naturalHeight }
                    return
                  }
                  const target = e.currentTarget as HTMLImageElement
                  const { naturalWidth, naturalHeight } = target
                  imageSizesRef.current[index] = { w: naturalWidth, h: naturalHeight }
                  computeLetterbox(naturalWidth, naturalHeight)
                }}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="100vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"
                aria-hidden="true"
              />
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-white w-8 h-3" : "bg-white/50 hover:bg-white/75 w-3 h-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Side animations when image doesn't fill width (desktop only) */}
        {showSideBars && (
          <>
            <div
              className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-[12%] z-10"
              aria-hidden="true"
            >
              <div className="w-full h-full bg-gradient-to-r from-white/20 via-white/10 to-transparent animate-pulse" />
            </div>
            <div
              className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 w-[12%] z-10"
              aria-hidden="true"
            >
              <div className="w-full h-full bg-gradient-to-l from-white/20 via-white/10 to-transparent animate-pulse" />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

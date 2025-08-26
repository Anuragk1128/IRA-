"use client"

import { useEffect, useRef, useState } from "react"

// Smoothly crossfade between multiple gradients while panning RTL.
// Mount this only on the homepage.
export default function ThemeRotator() {
  // Define multiple gray themes using the current palette (kept as-is)
  const THEMES = useRef<string[]>([
    "linear-gradient(135deg, rgb(230, 232, 235) 0%, rgb(215, 210, 210) 33%, rgb(162, 160, 160) 66%, rgb(83, 81, 81) 100%)",
    "linear-gradient(135deg, rgb(215, 210, 210) 0%, rgb(162, 160, 160) 33%, rgb(83, 81, 81) 66%, rgb(230, 232, 235) 100%)",
    "linear-gradient(135deg, rgb(162, 160, 160) 0%, rgb(83, 81, 81) 33%, rgb(230, 232, 235) 66%, rgb(215, 210, 210) 100%)",
    "linear-gradient(135deg, rgb(83, 81, 81) 0%, rgb(230, 232, 235) 33%, rgb(215, 210, 210) 66%, rgb(162, 160, 160) 100%)",
  ])

  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState(1)
  const [fadingIn, setFadingIn] = useState(false)

  // Timings: keep pan speed unchanged; add a gentle crossfade every 12s
  const CYCLE_MS = 12000
  const FADE_MS = 3000

  useEffect(() => {
    const id = setInterval(() => {
      // Start fade
      setFadingIn(true)

      // After fade duration, finalize indices
      const to = window.setTimeout(() => {
        setCurrent((prev) => next)
        setNext((prev) => (next + 1) % THEMES.current.length)
        setFadingIn(false)
      }, FADE_MS)

      return () => window.clearTimeout(to)
    }, CYCLE_MS)

    return () => clearInterval(id)
  }, [next])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Base layer (current) */}
      <div
        className={"absolute inset-0 ira-layer"}
        style={{ backgroundImage: THEMES.current[current] }}
      />
      {/* Fading layer (next) */}
      <div
        className={"absolute inset-0 ira-layer"}
        style={{
          backgroundImage: THEMES.current[next],
          opacity: fadingIn ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease-in-out`,
        }}
      />
      {/* Flow indicator overlay: low-opacity RGB band that travels with the theme */}
      <div className="absolute inset-0 ira-theme-flow-pointer" />
      <style jsx global>{`
        @keyframes IraThemeShift {
          0% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        /* Base style for gradient layers */
        .ira-layer {
          background-size: 400% 400%;
          animation: IraThemeShift 8s ease-in-out infinite; /* keep existing pan speed */
          will-change: background-position, opacity;
        }
        /* A subtle RGB gradient sash to show the direction of change */
        .ira-theme-flow-pointer {
          background-image: linear-gradient(
            90deg,
            rgba(255, 0, 0, 0) 0%,
            rgba(255, 0, 0, 0.12) 15%,
            rgba(255, 165, 0, 0.12) 28%,
            rgba(255, 255, 0, 0.12) 41%,
            rgba(0, 128, 0, 0.12) 54%,
            rgba(0, 0, 255, 0.12) 67%,
            rgba(75, 0, 130, 0.12) 80%,
            rgba(238, 130, 238, 0.12) 90%,
            rgba(255, 0, 0, 0) 100%
          );
          background-size: 300% 100%;
          animation: IraThemeShift 1s ease-in-out infinite;
          mix-blend-mode: overlay;
          opacity: 0.24;
          pointer-events: none;
          will-change: background-position, opacity;
        }
      `}</style>
    </div>
  )
}

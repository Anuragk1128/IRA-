"use client"

import { useEffect, useRef, useState } from "react"

// Clean Reel preview: HTML5 video only + CTA to visit Instagram profile.
// Drop a short vertical video file at public/reel-preview.mp4
// Requirements to autoplay: must be muted, loop, and playsInline.
export function Reels() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true) // must start muted for autoplay

  // Ensure initial mute + autoplay behavior on mount
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    // try play on mount (should succeed when muted)
    const playPromise = v.play()
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => setIsPlaying(false))
    }
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setIsPlaying(true)
    } else {
      v.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    const next = !v.muted
    v.muted = next
    setIsMuted(next)
  }

  return (
    <section className="w-full mx-auto px-4 py-8">
      <div className="mx-auto max-w-[420px]">
        <div className="relative overflow-hidden rounded-xl shadow-lg bg-black">
          {/* 9:16 vertical aspect ratio container */}
          <div className="relative w-full aspect-[9/16]">
            <video
              ref={videoRef}
              src="/instareel1.mp4"
              className="absolute inset-0 h-full w-full object-cover"
              muted={isMuted}
              loop
              autoPlay
              playsInline
              controls={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              // If the video fails to load, keep a clean fallback background
              onError={(e) => {
                const target = e.currentTarget as HTMLVideoElement
                target.outerHTML = `\n                  <a href="https://www.instagram.com/ira_by_evolve/" target="_blank" rel="noopener noreferrer"\n                     class=\"flex h-full w-full items-center justify-center text-white/90\">\n                    View on Instagram\n                  </a>\n                `
              }}
            />

            {/* Controls overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-3">
              <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-white shadow-md">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="rounded-full px-2 py-1 text-xs font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <span className="h-4 w-px bg-white/30" aria-hidden="true" />
                <button
                  type="button"
                  onClick={toggleMute}
                  className="rounded-full px-2 py-1 text-xs font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA to visit profile */}
        <div className="mt-4 flex justify-center">
          <a
            href="https://www.instagram.com/ira_by_evolve/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/30"
            aria-label="Visit Instagram Profile"
          >
            Visit Our Official Instagram Profile
          </a>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"

// Media grid: multiple reels (videos) and Instagram posts (images)
// Single video tile with per-tile controls
function VideoTile({ src, active, onEnded }: { src: string; active: boolean; onEnded: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  // Initialize video element
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = isMuted
    v.loop = false // we advance to next on ended
    v.playsInline = true
    if (active) {
      v.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    } else {
      v.pause();
      v.currentTime = 0
      setIsPlaying(false)
    }
  }, [active])

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
    <>
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 h-full w-full object-cover"
        muted={isMuted}
        playsInline
        controls={false}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={onEnded}
        onError={(e) => {
          const target = e.currentTarget as HTMLVideoElement
          target.outerHTML = `\n            <a href=\"https://www.instagram.com/ira_by_evolve/\" target=\"_blank\" rel=\"noopener noreferrer\"\n               class=\"flex h-full w-full items-center justify-center text-white/90 bg-black\">\n              View on Instagram\n            </a>\n          `
        }}
      />
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
    </>
  )
}

export function Reels() {
  const mediaItems: Array<
    | { type: "video"; src: string; aspect?: "9/16" | "1/1" }
    | { type: "image"; src: string; aspect?: "9/16" | "1/1" }
  > = [
    { type: "video", src: "/herovideo1.mp4", aspect: "9/16" },
    // Duplicate the same reel if no others yet; replace with more files when available
    { type: "video", src: "/instareel1.mp4", aspect: "9/16" },
    // Square image posts from public assets
    { type: "image", src: "/elegant-gold-earrings.png", aspect: "1/1" },
    { type: "image", src: "/elegant-gold-rings.png", aspect: "1/1" },
    { type: "image", src: "/elegant-gold-bracelets.png", aspect: "1/1" },
    { type: "image", src: "/diamond-earrings-ear.png", aspect: "1/1" },
  ]

  // Track which media index (of mediaItems) is the active video
  const videoIndices = mediaItems
    .map((item, i) => (item.type === "video" ? i : null))
    .filter((v): v is number => v !== null)
  const [activeMediaVideoIndex, setActiveMediaVideoIndex] = useState<number | null>(
    videoIndices.length > 0 ? videoIndices[0] : null
  )

  const handleVideoEnded = (endedIndex: number) => {
    // If the ended video is the current active one, advance to next available video (wrap)
    const pos = videoIndices.indexOf(endedIndex)
    if (pos === -1) return
    const nextPos = (pos + 1) % videoIndices.length
    setActiveMediaVideoIndex(videoIndices[nextPos])
  }

  return (
    <section className="w-full mx-auto px-4 py-10">
      {/* Section Title */}
      <h2 className="text-2xl font-semibold tracking-tight mb-6">Media</h2>

      {/* Grid of media */}
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaItems.map((item, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-xl shadow-sm bg-black/5">
              <div className={`relative w-full ${item.aspect === "9/16" ? "aspect-[9/16]" : "aspect-square"}`}>
                {item.type === "video" ? (
                  <VideoTile
                    src={item.src}
                    active={activeMediaVideoIndex === idx}
                    onEnded={() => handleVideoEnded(idx)}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt="Instagram post"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={idx < 3 ? "eager" : "lazy"}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA to visit profile */}
        <div className="mt-6 flex justify-center">
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

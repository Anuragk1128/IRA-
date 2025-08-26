"use client"

// Smooth, continuous animated gradient using brand colors.
// Mount this only on the homepage.
export default function ThemeRotator() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 ira-theme-animated" />
      {/* Flow indicator overlay: low-opacity RGB band that travels with the theme */}
      <div className="absolute inset-0 ira-theme-flow-pointer" />
      <style jsx global>{`
        @keyframes IraThemeShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .ira-theme-animated {
          background-image: linear-gradient(135deg, rgb(230, 232, 235)0%, rgb(215, 210, 210) 33%, rgb(162, 160, 160) 66%,rgb(83, 81, 81) 100%);
          background-size: 400% 400%;
          animation: IraThemeShift 22s ease-in-out infinite;
          will-change: background-position;
        }
        /* A subtle RGB gradient sash to show the direction of change */
        .ira-theme-flow-pointer {
          /* Narrow, soft band that traverses horizontally */
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
          animation: IraThemeShift 22s ease-in-out infinite;
          mix-blend-mode: overlay;
          opacity: 0.18;
          pointer-events: none;
          will-change: background-position, opacity;
        }
      `}</style>
    </div>
  )
}

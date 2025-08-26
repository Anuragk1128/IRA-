"use client"

// Smooth, continuous animated gradient using brand colors.
// Mount this only on the homepage.
export default function ThemeRotator() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 ira-theme-animated" />
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
      `}</style>
    </div>
  )
}

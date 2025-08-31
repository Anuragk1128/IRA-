"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"

export function RouteLoader() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => setMounted(true), [])

  // Show overlay on route changes
  useEffect(() => {
    if (!mounted) return
    // Show immediately on path change
    setShow(true)
    // Hide after a short delay to allow new route to paint
    const timeout = setTimeout(() => setShow(false), 1500)
    return () => clearTimeout(timeout)
  }, [pathname, mounted])

  if (!mounted) return null
  if (!show) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-[0.5px]">
      <div className="flex flex-col items-center gap-6">
        <img
          src="/Ira_Logo.svg"
          alt="IRA logo"
          className="h-20 w-20 md:h-24 md:w-24 animate-pulse"
        />
        <div className="flex items-center gap-2 text-sm text-black/60">
          <span className="h-2 w-2 rounded-full bg-black/60 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 rounded-full bg-black/60 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 rounded-full bg-black/60 animate-bounce"></span>
        </div>
      </div>
    </div>,
    document.body
  )
}

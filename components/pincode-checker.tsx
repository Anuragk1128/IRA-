"use client"

import React, { useEffect, useRef, useState } from "react"
import { MapPin, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PincodeCheckerProps {
  className?: string
  initialPincode?: string
}

// Simple serviceability mock: adjust as needed to match real rules/API
function getPincodeMessage(pin: string) {
  if (!/^\d{6}$/.test(pin)) return { ok: false, text: "Enter a valid 6-digit pincode" }
  // Example messages based on prefix
  if (pin.startsWith("56") || pin.startsWith("40")) return { ok: true, text: "Delivering in 2-4 days" }
  if (pin.startsWith("11") || pin.startsWith("12")) return { ok: true, text: "Delivering in 3-5 days" }
  return { ok: true, text: "Delivering in 4-7 days" }
}

export function PincodeChecker({ className, initialPincode }: PincodeCheckerProps) {
  const [open, setOpen] = useState(false)
  const [pin, setPin] = useState(initialPincode || "")
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load saved pincode
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("pincode")
      if (saved && /^\d{6}$/.test(saved)) {
        setSelectedPin(saved)
        setPin(saved)
        setMessage(getPincodeMessage(saved))
      }
    } catch {}
  }, [])

  // Close on outside click (for safety on touch devices)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [open])

  const handleCheck = () => {
    const res = getPincodeMessage(pin)
    setMessage(res)
    if (res.ok) {
      setSelectedPin(pin)
      try {
        window.localStorage.setItem("pincode", pin)
      } catch {}
    }
  }

  const handleClear = () => {
    setPin("")
    setMessage(null)
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative group", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 h-6 text-xs hover:bg-muted/60 transition-colors",
          open && "bg-muted"
        )}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <MapPin className="h-3 w-3" />
        <span className="hidden sm:inline">
          {selectedPin ? `Delivering to ${selectedPin}` : "Check delivery"}
        </span>
        <span className="sm:hidden">Pincode</span>
      </button>

      {/* Dropdown */}
      <Card
        className={cn(
          "absolute left-0 mt-2 w-64 p-2 shadow-lg border border-border bg-popover text-popover-foreground",
          "invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0",
          open && "visible opacity-100 translate-y-0",
          "transition-all duration-150 z-50"
        )}
        role="dialog"
        aria-label="Pincode checker"
      >
        <div className="flex items-center gap-2">
          <Input
            inputMode="numeric"
            pattern="\\d{6}"
            maxLength={6}
            placeholder="Enter 6-digit pincode"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            className="flex-1 h-8 text-sm"
          />
          <Button size="sm" className="h-8 px-3 text-xs" onClick={handleCheck}>
            Check
          </Button>
        </div>
        {message && (
          <div className={cn("mt-1 flex items-center gap-1 text-sm", message.ok ? "text-green-600" : "text-red-600")}
          >
            {message.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            <span>{message.text}</span>
          </div>
        )}
        {!!selectedPin && (
          <div className="mt-1 text-xs text-muted-foreground">Saved pincode: {selectedPin}</div>
        )}
      </Card>
    </div>
  )
}

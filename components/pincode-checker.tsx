"use client"

import React, { useEffect, useRef, useState } from "react"
import { MapPin, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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

  // No dropdown behavior anymore

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

  // No clear button in inline variant

  return (
    <div ref={containerRef} className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-black/80" />
        <Input
          inputMode="numeric"
          pattern="\\d{6}"
          maxLength={6}
          placeholder="Pincode"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
          className="h-8 w-24 md:w-28 text-xs"
        />
        <Button size="sm" className="h-8 px-2 text-xs" onClick={handleCheck}>
          Check
        </Button>
      </div>
      {message && (
        <div
          className={cn(
            "mt-1 flex items-center gap-1 text-xs",
            message.ok ? "text-black-900" : "text-red-800"
          )}
        >
          {message.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { SignupForm } from "@/components/auth/signup-form"
import { LoginForm } from "@/components/auth/login-form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Lightweight, non-modal popup (no overlay) that appears after 3s if unauthenticated.
// Reuses existing SignupForm without altering its functionality.
export function SignupPopup() {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"signup" | "login">("signup")

  // Show after 3s if no token, not authenticated, not dismissed this session, and not on auth pages
  useEffect(() => {
    if (isLoading) return
    if (pathname?.startsWith("/login") || pathname?.startsWith("/signup") || pathname?.startsWith("/account")) return

    const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null
    const dismissed = typeof window !== "undefined" ? sessionStorage.getItem("signup-popup-dismissed") === "1" : false

    if (!isAuthenticated && !token && !dismissed) {
      try { console.debug("SignupPopup: scheduling show in 3s", { pathname, token, dismissed }) } catch {}
      const t = setTimeout(() => setOpen(true), 3000)
      return () => clearTimeout(t)
    }
  }, [isAuthenticated, isLoading, pathname])

  // Close if auth state flips to authenticated
  useEffect(() => {
    if (isAuthenticated && open) setOpen(false)
  }, [isAuthenticated, open])

  if (isLoading || !open) return null

  const dismiss = () => {
    setOpen(false)
    try { sessionStorage.setItem("signup-popup-dismissed", "1") } catch {}
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] max-w-md w-[calc(100%-2rem)] sm:w-[28rem]">
      <Card className="relative border shadow-xl bg-background">
        <button
          aria-label="Close"
          className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted/60"
          onClick={dismiss}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-4 sm:p-6">
          <div className="mb-3">
            {mode === "signup" ? (
              <>
                <h3 className="text-lg font-semibold">Join IRA by House of Evolve</h3>
                <p className="text-sm text-muted-foreground">Create an account to save your wishlist and track orders.</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">Welcome Back</h3>
                <p className="text-sm text-muted-foreground">Sign in to access your account and orders.</p>
              </>
            )}
          </div>
          <div className="max-h-[70vh] overflow-auto pr-1">
            {mode === "signup" ? (
              <SignupForm redirectToAccount={false} onSwitchToLogin={() => setMode("login")} />
            ) : (
              <LoginForm redirectToAccount={false} onSwitchToSignup={() => setMode("signup")} />
            )}
          </div>
          <div className="mt-3 flex justify-between items-center">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            >
              {mode === "signup" ? "Have an account? Sign in" : "New here? Create an account"}
            </button>
            <Button variant="ghost" size="sm" onClick={dismiss}>Not now</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

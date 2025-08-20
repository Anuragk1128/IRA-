"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Enter a valid email",
        description: "Please check your email address and try again.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // If you later add an API route, point this fetch there.
      // For now, we just simulate a successful subscription.
      await new Promise((res) => setTimeout(res, 600))
      setEmail("")
      toast({
        title: "Subscribed!",
        description: "You'll receive our latest drops and offers.",
      })
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-black text-white border-y border-white/10">
      <div className="container mx-auto px-4 py-14 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-sm text-white/70">
              <Mail className="h-4 w-4 text-white/80" />
              <span>Newsletter</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Join the IRA insider list
            </h2>
            <p className="text-white/70">
              Be first to know about new collections, limited drops, and exclusive offers.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-white/5 text-white placeholder:text-white/60 border-white/20 focus-visible:ring-white"
              aria-label="Email address"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="shrink-0 bg-white text-black hover:bg-white/90"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
        <p className="mt-3 text-xs text-white/60">
          By subscribing, you agree to receive marketing emails. You can unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}

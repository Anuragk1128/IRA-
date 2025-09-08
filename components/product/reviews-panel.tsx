"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface Review {
  id: string
  text: string
  createdAt: string
}

interface ReviewsPanelProps {
  productId: string
}

export function ReviewsPanel({ productId }: ReviewsPanelProps) {
  const { isAuthenticated } = useAuth()
  const storageKey = `reviews:${productId}`
  const [reviews, setReviews] = useState<Review[]>([])
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as Review[]
        if (Array.isArray(parsed)) setReviews(parsed)
      }
    } catch (e) {
      // ignore malformed data
    }
  }, [storageKey])

  const save = (next: Review[]) => {
    setReviews(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch (e) {
      // storage might be full or disabled; ignore to keep UI functional
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) return
    if (!text.trim()) return
    setSubmitting(true)
    try {
      const newReview: Review = {
        id: `${Date.now()}`,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      }
      save([newReview, ...reviews])
      setText("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-6">
      {isAuthenticated ? (
        <form onSubmit={onSubmit} className="space-y-3">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your review..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!text.trim() || submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-md border p-4 bg-white/50">
          <p className="text-sm text-muted-foreground">
            Please <Link href="/login" className="text-primary underline">log in</Link> to post a review.
          </p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-6 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-md border p-4 bg-white/50">
              <p className="text-sm text-foreground whitespace-pre-wrap">{r.text}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

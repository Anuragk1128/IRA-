"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WishlistContent } from "@/components/wishlist/wishlist-content"

export default function WishlistPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <WishlistContent />
      </main>
      <Footer />
    </div>
  )
}

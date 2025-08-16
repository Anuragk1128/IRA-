"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartContent } from "@/components/cart/cart-content"

export default function CartPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CartContent />
      </main>
      <Footer />
    </div>
  )
}

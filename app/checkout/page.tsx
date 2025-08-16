"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutContent } from "@/components/checkout/checkout-content"
import { CheckoutProvider } from "@/contexts/checkout-context"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutProvider>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <CheckoutContent />
          </main>
          <Footer />
        </div>
      </CheckoutProvider>
    </ProtectedRoute>
  )
}

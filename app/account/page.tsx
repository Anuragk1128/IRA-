"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AccountDashboard } from "@/components/account/account-dashboard"

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <AccountDashboard />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}

import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { Toaster } from "@/components/ui/toaster"
import { SignupPopup } from "@/components/auth/signup-popup"
import { RouteLoader } from "@/components/route-loader"

// Removed Google font imports and variables to use system fonts only

export const metadata: Metadata = {
  title: "IRA by House of Evolve - Online Anti Tarnish Jewellery Shopping",
  description:
    "At IRA by House of Evolve, every piece is a narrative of artisanship, precision, and emotion. We blend contemporary aesthetics with timeless craftsmanship to create anti tarnish, sustainable jewellery that celebrates artistry and tells your story, one detail at a time.",
  generator: "v0.app",
  icons: {
    icon: "/Ira_Logo.svg",
    shortcut: "/Ira_Logo.svg",
    apple: "/Ira_Logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`antialiased`}>
      <body className="min-h-screen bg-background font-sans pt-14 md:pt-28">
        <RouteLoader />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <Toaster />
              {/* Lightweight signup popup for unauthenticated visitors */}
              <SignupPopup />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

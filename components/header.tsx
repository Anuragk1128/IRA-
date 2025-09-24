"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, User, Heart, Menu, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search/search-bar"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PincodeChecker } from "@/components/pincode-checker"

// Define collection keys for IRA brand
type CollectionKey = "necklaces" | "earrings" | "bangles"

// Map collection slug -> brand/category/subcategory slugs for IRA
const COLLECTION_MAP: Record<CollectionKey, { brandSlug: string; categorySlug: string; subcategorySlug: string; title: string; useCategory?: boolean }> = {
  "necklaces": { brandSlug: "ira", categorySlug: "necklace", subcategorySlug: "", title: "Necklaces", useCategory: true },
  "earrings": { brandSlug: "ira", categorySlug: "earrings", subcategorySlug: "", title: "Earrings", useCategory: true },
  "bangles": { brandSlug: "ira", categorySlug: "bangles", subcategorySlug: "round-bangles", title: "Bangles" }
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, signOut } = useAuth()
  const { cart } = useCart()
  const { wishlistItems } = useWishlist()
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false)
    }
    window.addEventListener('routeChangeComplete', handleRouteChange)
    return () => {
      window.removeEventListener('routeChangeComplete', handleRouteChange)
    }
  }, [])

  // Handle scroll-based header styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50) // Change to white after 50px scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Create navigation links using collection map
  const navLinks = [
    { href: "/categories", label: "Collections" },
    ...Object.entries(COLLECTION_MAP).map(([key, config]) => ({
      href: `/categories/${config.categorySlug}`,
      label: config.title
    }))
  ]

  // Create categories for mobile menu using collection map
  const staticCategories = Object.entries(COLLECTION_MAP).map(([key, config]) => ({
    id: key,
    name: config.title,
    slug: config.categorySlug,
    image: "/placeholder.svg"
  }))


  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out",
      isScrolled 
        ? "bg-white text-black border-b border-gray-200 shadow-sm" 
        : "bg-transparent text-white border-b border-transparent"
    )}>
      <div className="container mx-auto px-4">
        {/* Top bar - Logo, Search, Icons */}
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-12 w-12 rounded-full overflow-hidden ring-1 ring-border bg-muted flex items-center justify-center">
              <img
                src="/ira-logo.jpg"
                alt="IRA by House of Evolve logo"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            
          </Link>

          {/* Desktop Search centered in top bar */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-lg mx-8 justify-center">
            <SearchBar />
          </div>


          {/* Pincode checker - Desktop only */}
     

          {/* Mobile Search - Only visible when menu is open */}
          <div className={cn(
            "md:hidden w-full px-4 py-3 border-b border-border/40",
            isScrolled 
              ? "bg-white text-black" 
              : "bg-transparent text-black",
            isMobileMenuOpen ? 'block' : 'hidden'
          )}>
            <SearchBar />
          </div>

          {/* Action buttons (right) */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative text-black hover:bg-gray-100">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Button>

            {isAuthenticated ? (
              <Button variant="ghost" size="icon" asChild className="text-black hover:bg-gray-100">
                <Link href="/account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" asChild className="text-black hover:bg-gray-100">
                <Link href="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}

          
          </div>
        </div>

        {/* Bottom bar: Collections and Categories (desktop) */}
        <div className="hidden md:flex h-12 items-center justify-center">
          <nav className="flex items-center gap-6">
            {/* Collections root */}
            <Link
              href="/categories"
              className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              Collections
            </Link>
            {/* Static categories */}
            {staticCategories.map((cat) => (
                <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
                >
                  {cat.name}
                </Link>
            ))}
          </nav>
        </div>

        {/* Promotional Banner */}
        

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out transform border-t border-border/40 bg-white text-black",
          isMobileMenuOpen 
            ? "translate-y-28 opacity-100 visible" 
            : "-translate-y-full opacity-0 invisible"
        )}>
          {/* Overlay to prevent interaction with content behind */}
          <div className="absolute inset-0 bg-white -z-10" />
          <div className="container mx-auto px-0 py-2">
            
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="px-4 py-3 text-lg font-medium text-black hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Categories Dropdown */}
              <button
                className="px-4 py-3 text-lg font-semibold rounded-md bg-gray-100 hover:bg-gray-200 text-black transition-colors text-left flex items-center justify-between"
                onClick={() => setIsMobileCategoriesOpen((v) => !v)}
                aria-expanded={isMobileCategoriesOpen}
                aria-controls="mobile-categories-panel"
              >
                <span>Categories</span>
                <span className="text-gray-600">{isMobileCategoriesOpen ? "−" : "+"}</span>
              </button>
              <div
                id="mobile-categories-panel"
                className={cn(
                  "rounded-md overflow-hidden",
                  isMobileCategoriesOpen ? "block" : "hidden"
                )}
              >
                {staticCategories.map((cat) => (
                  <div key={cat.slug} className="px-2 py-2">
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="block px-2 py-2 rounded text-base hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  </div>
                ))}
              </div>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/account" 
                    className="px-4 py-3 text-lg font-medium text-foreground hover:bg-foreground/5 rounded-md transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-4 py-3 text-lg font-medium text-black hover:bg-gray-100 rounded-md transition-colors text-left flex items-center gap-2 w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-3 text-lg font-medium text-foreground hover:bg-foreground/5 rounded-md transition-colors flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, User, Heart, Menu, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search/search-bar"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PincodeChecker } from "@/components/pincode-checker"
import { categories as allCategories } from "@/lib/products"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, signOut } = useAuth()
  const { cart } = useCart()
  const { wishlist } = useWishlist()
  const [openMegaFor, setOpenMegaFor] = useState<string | null>(null)
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)

  // Close mobile menu when route changes (fallback, may not trigger in App Router)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false)
    }
    window.addEventListener('routeChangeComplete', handleRouteChange)
    return () => {
      window.removeEventListener('routeChangeComplete', handleRouteChange)
    }
  }, [])

  // Header is always visible now; removed scroll-based show/hide logic

  // Navigation links data
  const navLinks = [
    { href: "/categories", label: "Collections" },
    { href: "/categories/rings", label: "Rings" },
    { href: "/categories/necklaces", label: "Necklaces" },
    { href: "/categories/earrings", label: "Earrings" },
    { href: "/categories/bracelets", label: "Bracelets" },
  ]

  // Facets for mega menu
  const materials = [
    { label: "Silver coated", slug: "diamond" },
    { label: "Gold coated", slug: "platinum" },
    { label: "Stainless Steel", slug: "gemstone" },
    { label: "Copper", slug: "gold" },
  ] as const

  const priceRanges = [
    { label: "Under ₹10K", min: 0, max: 10000 },
    { label: "₹10K - ₹20K", min: 10000, max: 20000 },
    { label: "₹20K - ₹30K", min: 20000, max: 30000 },
    { label: "₹30K - ₹50K", min: 30000, max: 50000 },
    { label: "₹50K - ₹75K", min: 50000, max: 75000 },
    { label: "Over ₹75K", min: 75000, max: undefined as number | undefined },
  ] as const

  const occasions = [
    { label: "Daily Wear", slug: "daily" },
    { label: "Casual Outings", slug: "casual" },
    { label: "Festive", slug: "festive" },
    { label: "Anniversary", slug: "anniversary" },
    { label: "Wedding", slug: "wedding" },
  ] as const

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-border/40 bg-black text-white px-2"
      )}
    >
      <div className="container mx-auto px-4">
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
            <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-border bg-muted flex items-center justify-center">
              <img
                src="/ira-logo.jpg"
                alt="IRA by House of Evolve logo"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <span className="sr-only">IRA by House of Evolve</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const matchedCategory = allCategories.find(
                (c) => link.href === `/categories/${c.slug}`
              )
              const hasSubcats = matchedCategory && matchedCategory.subcategories && matchedCategory.subcategories.length > 0
              if (!hasSubcats) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-white hover:text-white/80 transition-colors"
                    onMouseEnter={() => setOpenMegaFor(null)}
                  >
                    {link.label}
                  </Link>
                )
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white hover:text-white/80 transition-colors"
                  onMouseEnter={() => setOpenMegaFor(matchedCategory!.slug)}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Fixed mega menu panel (desktop) */}
          {openMegaFor && (
            <div
              className={cn(
                "hidden md:block fixed left-0 right-0 top-16 z-40 border-t border-border/40 bg-black text-white shadow-xl",
              )}
              onMouseLeave={() => setOpenMegaFor(null)}
              onMouseEnter={() => void 0}
              role="menu"
              aria-label="Category mega menu"
            >
              {(() => {
                const cat = allCategories.find((c) => c.slug === openMegaFor)
                if (!cat) return null
                return (
                  <div className="w-full px-4 md:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 md:p-6 max-h-[70vh] overflow-y-auto">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Shop by Style</div>
                        <div className="space-y-1">
                          {cat.subcategories?.map((sub) => (
                            <Link key={sub.id} href={`/categories/${cat.slug}?sub=${sub.slug}`} className="block px-2 py-1.5 text-sm rounded hover:bg-white/10">
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Shop by Material</div>
                        <div className="space-y-1">
                          {materials.map((m) => (
                            <Link key={m.slug} href={`/categories/${cat.slug}?material=${m.slug}`} className="block px-2 py-1.5 text-sm rounded hover:bg-white/10">
                              {m.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Shop for</div>
                        <div className="space-y-1">
                          {priceRanges.map((pr, idx) => {
                            const params = new URLSearchParams()
                            if (typeof pr.min === 'number') params.set('min', String(pr.min))
                            if (typeof pr.max === 'number') params.set('max', String(pr.max))
                            return (
                              <Link key={idx} href={`/categories/${cat.slug}?${params.toString()}`} className="block px-2 py-1.5 text-sm rounded hover:bg-white/10">
                                {pr.label}
                              </Link>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Shop by Occasion</div>
                        <div className="space-y-1">
                          {occasions.map((o) => (
                            <Link key={o.slug} href={`/categories/${cat.slug}?occasion=${o.slug}`} className="block px-2 py-1.5 text-sm rounded hover:bg-white/10">
                              {o.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="border-top border-border/40 px-6 py-3 flex items-center justify-between">
                      <Link href={`/categories/${cat.slug}`} className="text-sm font-medium hover:text-white/80">
                        View all {cat.name}
                      </Link>
                      <div className="hidden md:flex items-center gap-3">
                        <div className="h-16 w-28 rounded-md overflow-hidden ring-1 ring-border bg-muted">
                          <img src={cat.image ?? '/placeholder.svg?height=128&width=224'} alt={cat.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="text-xs text-white/70 max-w-[18rem]">
                          Explore curated {cat.name.toLowerCase()} crafted for every style and occasion.
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Pincode checker - Desktop only */}
          <div className="hidden md:flex items-center ml-4 text-white">
            <PincodeChecker />
          </div>

          {/* Search bar - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-8">
            <SearchBar />
          </div>
          
          {/* Mobile Search - Only visible when menu is open */}
          <div className={cn(
            "md:hidden w-full px-4 py-3 bg-black text-white border-b border-border/40",
            isMobileMenuOpen ? 'block' : 'hidden'
          )}>
            <SearchBar />
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative text-white">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
              {wishlist.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                  {wishlist.itemCount}
                </span>
              )}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {user?.firstName} {user?.lastName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=addresses">Addresses</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild className="text-white">
                <Link href="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" className="relative text-white">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
              </Link>
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden fixed inset-0 bg-black text-white z-50 transition-all duration-300 ease-in-out transform border-t border-border/40",
          isMobileMenuOpen 
            ? "translate-y-16 opacity-100 visible" 
            : "-translate-y-full opacity-0 invisible"
        )}>
          {/* Overlay to prevent interaction with content behind */}
          <div className="absolute inset-0 bg-black -z-10" />
          <div className="container mx-auto px-0 py-2">
            
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="px-4 py-3 text-lg font-medium text-white hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Categories Dropdown (dark) */}
              <button
                className="px-4 py-3 text-lg font-semibold rounded-md bg-white/10 hover:bg-white/15 transition-colors text-white text-left flex items-center justify-between"
                onClick={() => setIsMobileCategoriesOpen((v) => !v)}
                aria-expanded={isMobileCategoriesOpen}
                aria-controls="mobile-categories-panel"
              >
                <span>Categories</span>
                <span className="text-white/70">{isMobileCategoriesOpen ? "−" : "+"}</span>
              </button>
              <div
                id="mobile-categories-panel"
                className={cn(
                  "rounded-md overflow-hidden",
                  isMobileCategoriesOpen ? "block" : "hidden"
                )}
              >
                {allCategories.map((cat) => (
                  <div key={cat.slug} className="px-2 py-2">
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="block px-2 py-2 rounded text-base hover:bg-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                    {!!cat.subcategories?.length && (
                      <div className="pl-4">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/categories/${cat.slug}?sub=${sub.slug}`}
                            className="block px-2 py-1.5 text-sm text-white/90 rounded hover:bg-white/10"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/account" 
                    className="px-4 py-3 text-lg font-medium text-white hover:bg-white/10 rounded-md transition-colors flex items-center gap-2"
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
                    className="px-4 py-3 text-lg font-medium text-white hover:bg-white/10 rounded-md transition-colors text-left flex items-center gap-2 w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-3 text-lg font-medium text-white hover:bg-white/10 rounded-md transition-colors flex items-center gap-2"
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

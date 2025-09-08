"use client"

import { useState, useEffect } from "react"
import {  User, Heart, Menu, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search/search-bar"
import { useAuth } from "@/contexts/auth-context"
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
import { fetchCategoriesFromApi, fetchBrandSubcategories, fetchAllProductsForAttributes, type BackendCategory } from "@/lib/catalog"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, signOut } = useAuth()
  const { wishlistItems } = useWishlist()
  const [openMegaFor, setOpenMegaFor] = useState<string | null>(null)
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
  const [overHero, setOverHero] = useState(false)
  const [categories, setCategories] = useState<BackendCategory[]>([])
  const [backendAttributes, setBackendAttributes] = useState<{
    materials: string[]
    priceRanges: { label: string; min: number; max: number | undefined }[]
    occasions: string[]
  } | null>(null)
  const brandSlug = process.env.NEXT_PUBLIC_BRAND_SLUG || "ira"

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

  // Helper to lazy-load subcategories for a category when needed (on hover)
  const ensureSubcategories = async (categorySlug: string) => {
    const slug = categorySlug
    const existing = categories.find(c => (c.slug || toSlug(c.name)) === slug)
    if (!existing) return
    // If already loaded (non-empty array), skip
    if (Array.isArray(existing.subcategories) && existing.subcategories.length > 0) return
    try {
      const subs = await fetchBrandSubcategories(brandSlug, slug)
      setCategories(prev => prev.map(c => (
        (c.slug || toSlug(c.name)) === slug ? { ...c, subcategories: subs } : c
      )))
    } catch (e) {
      // swallow errors; UI will just show no subs
    }
  }

  // Header is always visible now; removed scroll-based show/hide logic
  // Toggle header theme based on scroll position if hero sentinel exists (homepage only)
  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) {
      setOverHero(false) // default solid white on non-home pages
      return
    }
    const onScroll = () => {
      // Immediately turn white once user scrolls down any amount; transparent only at very top
      setOverHero(window.scrollY <= 0)
    }
    // Initialize state on mount
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fetch categories from backend
  useEffect(() => {
    let mounted = true
    fetchCategoriesFromApi()
      .then((cats) => {
        if (mounted) setCategories(cats)
      })
      .catch(() => {
        if (mounted) setCategories([])
      })
    return () => {
      mounted = false
    }
  }, [])

  // Fetch backend attributes for dropdowns
  useEffect(() => {
    let mounted = true
    fetchAllProductsForAttributes()
      .then((attrs) => {
        if (mounted) setBackendAttributes(attrs)
      })
      .catch(() => {
        if (mounted) setBackendAttributes(null)
      })
    return () => {
      mounted = false
    }
  }, [])

  const toSlug = (s?: string) =>
    (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

  // Navigation links data
  const navLinks = [
    { href: "/categories", label: "Collections" },
  ]

  // Use backend attributes or fallback to hardcoded values
  const materials = backendAttributes?.materials.map(material => ({
    label: material,
    slug: material.toLowerCase().replace(/\s+/g, '-')
  })) || [
    { label: "Silver coated", slug: "silver-coated" },
    { label: "Gold coated", slug: "gold-coated" },
    { label: "Stainless Steel", slug: "stainless-steel" },
    { label: "Copper", slug: "copper" },
  ]

  const priceRanges = backendAttributes?.priceRanges || [
    { label: "₹1,000 - ₹1,500", min: 1000, max: 1500 },
    { label: "₹1,500 - ₹2,000", min: 1500, max: 2000 },
    { label: "₹2,000 - ₹2,500", min: 2000, max: 2500 },
    { label: "₹2,500 - ₹3,000", min: 2500, max: 3000 },
    { label: "₹3,000+", min: 3000, max: undefined },
  ]

  const occasions = backendAttributes?.occasions.map(occasion => ({
    label: occasion,
    slug: occasion.toLowerCase().replace(/\s+/g, '-')
  })) || [
    { label: "Daily Wear", slug: "daily-wear" },
    { label: "Casual Outings", slug: "casual-outings" },
    { label: "Festive", slug: "festive" },
    { label: "Anniversary", slug: "anniversary" },
    { label: "Wedding", slug: "wedding" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full text-black",
        overHero ? "bg-transparent border-b border-transparent" : "bg-white border-b border-border/40"
      )}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between relative">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-9 w-9 relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 md:h-5 md:w-5" /> : <Menu className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden ring-1 ring-border bg-muted flex items-center justify-center -mt-1 md:mt-0">
              <img
                src="/ira-logo.jpg"
                alt="IRA by House of Evolve logo"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <span className="sr-only">IRA by House of Evolve</span>
          </Link>

          {/* Desktop Search: centered; constrained width at md/lg, full at xl */}
          <div className="hidden md:flex items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2 w-full md:max-w-sm lg:max-w-md xl:max-w-xl md:px-2 lg:px-3 xl:px-4">
            <SearchBar />
          </div>

          {/* Fixed mega menu panel (desktop) */}
          {openMegaFor && (
            <div
              className={cn(
                "hidden md:block fixed left-0 right-0 top-28 z-40 border-t border-border/40 bg-white text-black shadow-xl",
              )}
              onMouseLeave={() => setOpenMegaFor(null)}
              onMouseEnter={() => void 0}
              role="menu"
              aria-label="Category mega menu"
            >
              {(() => {
                const cat = categories.find((c) => (c.slug || toSlug(c.name)) === openMegaFor)
                if (!cat) return null
                return (
                  <div className="w-full px-4 md:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 md:p-6 max-h-[70vh] overflow-y-auto">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Shop by Style</div>
                        <div className="space-y-1">
                          {cat.subcategories?.map((sub) => (
                            <Link key={sub.id} href={`/categories/${cat.slug ?? toSlug(cat.name)}?catId=${cat.id}&subId=${sub.id}`} className="block px-2 py-1.5 text-sm rounded hover:bg-black/5">
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Shop by Material</div>
                        <div className="space-y-1">
                          {materials.map((m) => (
                            <Link key={m.slug} href={`/categories/${cat.slug}?material=${m.slug}`} className="block px-2 py-1.5 text-sm rounded hover:bg-black/5">
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
                              <Link key={idx} href={`/categories/${cat.slug}?${params.toString()}`} className="block px-2 py-1.5 text-sm rounded hover:bg-black/5">
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
                            <Link key={o.slug} href={`/categories/${cat.slug}?occasion=${o.slug}`} className="block px-2 py-1.5 text-sm rounded hover:bg-black/5">
                              {o.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="border-top border-border/40 px-6 py-3 flex items-center justify-between">
                      <Link href={`/categories/${cat.slug ?? toSlug(cat.name)}?catId=${cat.id}`} className="text-sm font-medium hover:text-black/80">
                        View all {cat.name}
                      </Link>
                      <div className="hidden md:flex items-center gap-3">
                        <div className="h-16 w-28 rounded-md overflow-hidden ring-1 ring-border bg-muted">
                          <img src={cat.image ?? '/placeholder.svg?height=128&width=224'} alt={cat.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="text-xs text-black/70 max-w-[18rem]">
                          Explore curated {cat.name.toLowerCase()} crafted for every style and occasion.
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Mobile Search - Only visible when menu is open */}
          <div className={cn(
            "md:hidden w-full px-4 py-3 bg-white text-black border-b border-border/40",
            isMobileMenuOpen ? 'block' : 'hidden'
          )}>
            <SearchBar />
          </div>

          {/* Action buttons (right) */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Pincode checker - show on xl+ to avoid overlap on 1024x1366 */}
            <div className="hidden xl:flex items-center mr-2 text-black">
              <PincodeChecker />
            </div>
            <Button variant="ghost" size="icon" className="relative text-black h-9 w-9 md:h-10 md:w-10 shrink-0">
              <Link href="/wishlist">
                <Heart className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
              {wishlistItems.length > 0 && (
                <span className="hidden sm:flex absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-black h-9 w-9 md:h-10 md:w-10 shrink-0">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
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
              <Button variant="ghost" size="icon" asChild className="text-black h-9 w-9 md:h-10 md:w-10 shrink-0">
                <Link href="/login">
                  <User className="h-4 w-4 md:h-5 md:w-5" />
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
              className="text-sm font-medium hover:text-black/80 transition-colors"
              onMouseEnter={() => setOpenMegaFor(null)}
            >
              Collections
            </Link>
            {/* Dynamic categories from backend */}
            {categories.map((cat) => {
              const slug = cat.slug ?? toSlug(cat.name)
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${slug}?catId=${cat.id}`}
                  className="text-sm font-medium hover:text-black/80 transition-colors"
                  onMouseEnter={async () => {
                    setOpenMegaFor(slug)
                    await ensureSubcategories(slug)
                  }}
                >
                  {cat.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden fixed inset-0 bg-white text-black z-40 transition-all duration-300 ease-in-out border-t border-border/40 pt-24 overflow-y-auto overscroll-contain",
          isMobileMenuOpen 
            ? "opacity-100 visible pointer-events-auto" 
            : "opacity-0 invisible pointer-events-none"
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
                  className="px-4 py-3 text-lg font-medium text-black hover:bg-black/5 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Categories Dropdown (dark) */}
              <button
                className="px-4 py-3 text-lg font-semibold rounded-md bg-black/5 hover:bg-black/10 transition-colors text-black text-left flex items-center justify-between"
                onClick={() => setIsMobileCategoriesOpen((v) => !v)}
                aria-expanded={isMobileCategoriesOpen}
                aria-controls="mobile-categories-panel"
              >
                <span>Categories</span>
                <span className="text-black/70">{isMobileCategoriesOpen ? "−" : "+"}</span>
              </button>
              <div
                id="mobile-categories-panel"
                className={cn(
                  "rounded-md overflow-hidden",
                  isMobileCategoriesOpen ? "block" : "hidden"
                )}
              >
                {categories.map((cat) => (
                  <div key={cat.id} className="px-2 py-2">
                    <Link
                      href={`/categories/${cat.slug ?? toSlug(cat.name)}?catId=${cat.id}`}
                      className="block px-2 py-2 rounded text-base hover:bg-black/5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                    {!!cat.subcategories?.length && (
                      <div className="pl-4">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/categories/${cat.slug ?? toSlug(cat.name)}?catId=${cat.id}&subId=${sub.id}`}
                            className="block px-2 py-1.5 text-sm text-black/90 rounded hover:bg-black/5"
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
                    className="px-4 py-3 text-lg font-medium text-black hover:bg-black/5 rounded-md transition-colors flex items-center gap-2"
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
                    className="px-4 py-3 text-lg font-medium text-black hover:bg-black/5 rounded-md transition-colors text-left flex items-center gap-2 w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-3 text-lg font-medium text-black hover:bg-black/5 rounded-md transition-colors flex items-center gap-2"
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

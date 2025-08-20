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
import { categories as allCategories } from "@/lib/products"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, signOut } = useAuth()
  const { cart } = useCart()
  const { wishlist } = useWishlist()
  const [showHeader, setShowHeader] = useState(false)

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

  // Show header when user scrolls; keep it hidden at top unless menu is open
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 0
      setShowHeader(scrolled || isMobileMenuOpen)
    }
    // Initialize on mount
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobileMenuOpen])

  // Navigation links data
  const navLinks = [
    { href: "/categories", label: "Collections" },
    { href: "/categories/rings", label: "Rings" },
    { href: "/categories/necklaces", label: "Necklaces" },
    { href: "/categories/earrings", label: "Earrings" },
    { href: "/categories/bracelets", label: "Bracelets" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transform transition-all duration-300",
        showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
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
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">I</span>
            </div>
            <span className="font-elegant text-xl font-semibold text-gradient">IRA Jewelry</span>
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
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              }
              return (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                  {/* Subcategories dropdown */}
                  <div
                    className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 mt-2 min-w-[14rem] rounded-md border border-border bg-popover text-popover-foreground shadow-lg"
                  >
                    <div className="py-1">
                      {matchedCategory!.subcategories!.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/categories/${matchedCategory!.slug}?sub=${sub.slug}`}
                          className="block px-3 py-2 text-sm hover:bg-accent/10"
                        >
                          {sub.name}
                        </Link>
                      ))}
                      <div className="my-1 h-px bg-border" />
                      <Link
                        href={`/categories/${matchedCategory!.slug}`}
                        className="block px-3 py-2 text-sm font-medium hover:bg-accent/10"
                      >
                        View all {matchedCategory!.name}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>

          {/* Search bar - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-8">
            <SearchBar />
          </div>
          
          {/* Mobile Search - Only visible when menu is open */}
          <div className={cn(
            "md:hidden w-full px-4 py-3 bg-background border-b border-border",
            isMobileMenuOpen ? 'block' : 'hidden'
          )}>
            <SearchBar />
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
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
                  <Button variant="ghost" size="icon">
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
              <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" className="relative">
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
          "md:hidden fixed inset-0 bg-background z-50 transition-all duration-300 ease-in-out transform border-t border-border",
          isMobileMenuOpen 
            ? "translate-y-16 opacity-100 visible" 
            : "-translate-y-full opacity-0 invisible"
        )}>
          {/* Overlay to prevent interaction with content behind */}
          <div className="absolute inset-0 bg-background -z-10" />
          <div className="container mx-auto px-0 py-2">
            
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="px-4 py-3 text-lg font-medium hover:bg-accent/10 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/account" 
                    className="px-4 py-3 text-lg font-medium hover:bg-accent/10 rounded-md transition-colors flex items-center gap-2"
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
                    className="px-4 py-3 text-lg font-medium hover:bg-accent/10 rounded-md transition-colors text-left flex items-center gap-2 w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-3 text-lg font-medium hover:bg-accent/10 rounded-md transition-colors flex items-center gap-2"
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

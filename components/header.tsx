"use client"

import { ShoppingBag, User, Heart, Menu, LogOut } from "lucide-react"
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

export function Header() {
  const { user, isAuthenticated, signOut } = useAuth()
  const { cart } = useCart()
  const { wishlist } = useWishlist()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">I</span>
            </div>
            <span className="font-elegant text-xl font-semibold text-gradient">IRA Jewelry</span>
          </Link>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Collections
            </Link>
            <Link href="/categories/rings" className="text-sm font-medium hover:text-primary transition-colors">
              Rings
            </Link>
            <Link href="/categories/necklaces" className="text-sm font-medium hover:text-primary transition-colors">
              Necklaces
            </Link>
            <Link href="/categories/earrings" className="text-sm font-medium hover:text-primary transition-colors">
              Earrings
            </Link>
            <Link href="/categories/bracelets" className="text-sm font-medium hover:text-primary transition-colors">
              Bracelets
            </Link>
          </nav>

          {/* Search bar - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-8">
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
      </div>
    </header>
  )
}

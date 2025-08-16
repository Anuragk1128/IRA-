"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Wishlist, WishlistItem } from "@/types/cart"
import type { Product } from "@/types/product"

interface WishlistContextType {
  wishlist: Wishlist
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Wishlist>({
    items: [],
    itemCount: 0,
  })

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("luxe-jewelry-wishlist")
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        setWishlist({
          items: parsedWishlist.items || [],
          itemCount: parsedWishlist.items?.length || 0,
        })
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("luxe-jewelry-wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      // Check if item already exists
      if (prevWishlist.items.some((item) => item.productId === product.id)) {
        return prevWishlist
      }

      const newItem: WishlistItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0] || "/placeholder.svg",
        material: product.material,
        color: product.color,
        size: product.size,
        inStock: product.inStock,
        addedAt: new Date().toISOString(),
      }

      const newItems = [...prevWishlist.items, newItem]
      return {
        items: newItems,
        itemCount: newItems.length,
      }
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      const newItems = prevWishlist.items.filter((item) => item.productId !== productId)
      return {
        items: newItems,
        itemCount: newItems.length,
      }
    })
  }

  const clearWishlist = () => {
    setWishlist({
      items: [],
      itemCount: 0,
    })
  }

  const isInWishlist = (productId: string) => {
    return wishlist.items.some((item) => item.productId === productId)
  }

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

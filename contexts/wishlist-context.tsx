"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "./auth-context"
import { addToWishlist as addToWishlistApi, removeFromWishlist as removeFromWishlistApi, getWishlist as getWishlistApi, type WishlistItem } from "@/lib/wishlist"
import { toast } from "@/components/ui/use-toast"

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  isLoading: boolean
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (wishlistItemId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  fetchWishlist: () => Promise<void>
  toggleWishlist: (productId: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const token = user?.token || ''

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !token) return
    
    setIsLoading(true)
    try {
      const items = await getWishlistApi(token)
      setWishlistItems(items)
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, token])

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist()
    } else {
      setWishlistItems([])
    }
  }, [isAuthenticated, fetchWishlist])

  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to your wishlist.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const newItem = await addToWishlistApi(productId, token)
      if (newItem) {
        setWishlistItems(prev => [newItem, ...prev])
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist.",
        })
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (wishlistItemId: string) => {
    if (!isAuthenticated || !token) return

    try {
      setIsLoading(true)
      const success = await removeFromWishlistApi(wishlistItemId, token)
      if (success) {
        setWishlistItems(prev => prev.filter(item => item._id !== wishlistItemId))
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist.",
        })
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product._id === productId)
  }

  const toggleWishlist = async (productId: string) => {
    const item = wishlistItems.find(item => item.product._id === productId)
    if (item) {
      await removeFromWishlist(item._id)
    } else {
      await addToWishlist(productId)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist,
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

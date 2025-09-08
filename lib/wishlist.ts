import { toast } from "@/components/ui/use-toast"
import { Product } from "@/types/product"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hoe-be.onrender.com/api'

export interface WishlistItem {
  _id: string
  user: string
  product: Product & { _id: string }
  createdAt: string
  updatedAt: string
}

export async function addToWishlist(productId: string, token: string): Promise<WishlistItem | null> {
  try {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ product: productId })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to add to wishlist')
    }

    return await response.json()
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    toast({
      variant: "destructive",
      title: "Error",
      description: error instanceof Error ? error.message : 'Failed to add to wishlist',
    })
    return null
  }
}

export async function getWishlist(token: string): Promise<WishlistItem[]> {
  try {
    const response = await fetch(`${API_URL}/wishlist/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch wishlist')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    toast({
      variant: "destructive",
      title: "Error",
      description: 'Failed to load wishlist',
    })
    return []
  }
}

export async function removeFromWishlist(itemId: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/wishlist/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to remove from wishlist')
    }

    return true
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    toast({
      variant: "destructive",
      title: "Error",
      description: 'Failed to remove from wishlist',
    })
    return false
  }
}

"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from "@/lib/wishlist-utils"

interface WishlistButtonProps {
  productId: string
  productName: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
  className?: string
  showText?: boolean
}

export function WishlistButton({ 
  productId, 
  productName, 
  size = "default", 
  variant = "ghost",
  className = "",
  showText = false 
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Check initial wishlist status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkWishlistStatus(productId)
        setIsInWishlist(status)
      } catch (error) {
        console.error('Error checking wishlist status:', error)
      }
    }
    checkStatus()
  }, [productId])

  const handleToggleWishlist = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      
      if (isInWishlist) {
        await removeFromWishlist(productId)
        setIsInWishlist(false)
        toast({
          title: "Removed from wishlist",
          description: `${productName} has been removed from your wishlist.`,
        })
      } else {
        await addToWishlist(productId)
        setIsInWishlist(true)
        toast({
          title: "Added to wishlist",
          description: `${productName} has been added to your wishlist.`,
        })
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      toast({
        title: "Error",
        description: `Failed to ${isInWishlist ? 'remove from' : 'add to'} wishlist. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} ${isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}`}
      onClick={handleToggleWishlist}
      disabled={isLoading}
    >
      <Heart 
        className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''} ${isLoading ? 'animate-pulse' : ''}`} 
      />
      {showText && (
        <span className="ml-2">
          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  )
}

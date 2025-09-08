"use client"

import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/contexts/wishlist-context"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  className?: string
  variant?: "default" | "ghost" | "outline" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

export function WishlistButton({
  productId,
  className,
  variant = "outline",
  size = "default",
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist()
  const isWishlisted = isInWishlist(productId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(productId)
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(
        "relative transition-colors",
        isWishlisted && "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600",
        className
      )}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={cn("h-4 w-4", isWishlisted && "fill-current")}
          aria-hidden="true"
        />
      )}
    </Button>
  )
}

"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { addToCartAPI } from "@/lib/cart"

interface AddToCartButtonProps {
  productId: string | number
  productName: string
  inStock?: boolean
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "secondary" | "outline" | "destructive" | "ghost" | "link"
  className?: string
}

export function AddToCartButton({ productId, productName, inStock = true, size = "default", variant = "default", className }: AddToCartButtonProps) {
  const { toast } = useToast()

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!inStock) {
      toast({ title: "Out of stock", description: "This item is currently out of stock.", variant: "destructive" })
      return
    }

    try {
      await addToCartAPI({ productId: String(productId), quantity: 1 })
      toast({ title: "Added to cart", description: `${productName} has been added to your cart.` })
    } catch (err) {
      toast({
        title: "Failed to add to cart",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <Button className={className} size={size} variant={variant} onClick={handleClick} disabled={!inStock}>
      <ShoppingCart className="h-4 w-4" />
      <span className={size === "icon" ? "sr-only" : ""}>Add to Cart</span>
    </Button>
  )
}

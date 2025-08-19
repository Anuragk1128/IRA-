"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { getProductById } from "@/lib/products"

type ButtonSize = "default" | "sm" | "lg" | "icon"

interface AddToCartButtonProps {
  productId: string
  productName: string
  inStock: boolean
  className?: string
  size?: ButtonSize
}

export function AddToCartButton({
  productId,
  productName,
  inStock,
  className,
  size = "default",
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  const handleAdd = async () => {
    if (!inStock || loading) return
    setLoading(true)
    try {
      // 1) Call backend API
      const res = await fetch("https://ira-be.onrender.com/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
        credentials: "include",
      })

      if (!res.ok) {
        const msg = await safeErrorMessage(res)
        throw new Error(msg || "Failed to add to cart")
      }

      // 2) Update local UI cart state immediately
      const product = getProductById(productId)
      if (product) {
        addToCart(product, 1)
      }

      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart.`,
      })
    } catch (err) {
      toast({
        title: "Could not add to cart",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={!inStock || loading}
      className={className}
      size={size}
    >
      {inStock ? (loading ? "Adding..." : "Add to Cart") : "Out of Stock"}
    </Button>
  )
}

async function safeErrorMessage(res: Response) {
  try {
    const data = await res.json()
    return (data && (data.message || data.error)) as string | undefined
  } catch {
    return undefined
  }
}
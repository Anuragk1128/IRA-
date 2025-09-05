"use client"

import React from "react"
import { Button } from "@/components/ui/button"

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
  // Render an anchor inside Button to ensure correct URL and allow middle-click/open in new tab
  return (
    <Button className={className} size={size} asChild>
      <a
        href={`https://hoe-fe.vercel.app/products/${productId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Shop Now
      </a>
    </Button>
  )
}
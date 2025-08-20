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
  // Open external shop in a new tab without rendering an <a> to avoid nested anchors
  return (
    <Button
      className={className}
      size={size}
      onClick={() => window.open("https://v0-hoe.vercel.app", "_blank", "noopener,noreferrer")}
    > 
      Shop Now
    </Button>
  )
}
"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WishlistButton } from "@/components/wishlist/wishlist-button"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types/product"
import { AddToCartButton } from "@/components/product/add-to-cart-button"
import { formatCurrencyINR } from "@/lib/currency"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // Debug logging to check tax fields
  console.log('Product tax data:', {
    id: product.id,
    name: product.name,
    price: product.price,
    priceIncludingTax: product.priceIncludingTax,
    taxAmount: product.taxAmount,
    gstRate: product.gstRate
  })

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          {(() => {
            // Check if the image URL is valid
            const isValidUrl = (url: string | undefined): boolean => {
              if (!url) return false;
              try {
                new URL(url);
                return true;
              } catch {
                return false;
              }
            };
            
            const imageUrl = isValidUrl(product.images?.[0]) ? product.images?.[0] : "/placeholder.svg";
            
            return (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = "/placeholder.svg";
                }}
              />
            );
          })()}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-accent/90 text-accent-foreground shadow-sm">-{discountPercentage}%</Badge>
          )}
          {product.newArrival && (
            <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground shadow-sm">New</Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground ml-1">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-semibold text-foreground">
            {product.priceIncludingTax ? formatCurrencyINR(product.priceIncludingTax) : formatCurrencyINR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatCurrencyINR(product.originalPrice)}</span>
          )}
        </div>
        {product.priceIncludingTax && product.priceIncludingTax !== product.price && (
          <div className="text-xs text-muted-foreground mt-1">
            <span>Base: {formatCurrencyINR(product.price)}</span>
            {product.taxAmount && (
              <span className="ml-2">
                + GST{product.gstRate ? ` (${product.gstRate}%)` : ''}: {formatCurrencyINR(product.taxAmount)}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-2.5">
          <AddToCartButton
            className="flex-1"
            size="sm"
            productId={product.id}
            productName={product.name}
            inStock={product.inStock}
          />
          <WishlistButton
            productId={product.id}
            productName={product.name}
            size="sm"
            variant="outline"
          />
        </div>
      </div>
    </div>
  )
}

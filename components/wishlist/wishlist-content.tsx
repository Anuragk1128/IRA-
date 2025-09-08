"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/components/ui/use-toast"
import { AddToCartButton } from "@/components/product/add-to-cart-button"
import { formatCurrencyINR } from "@/lib/currency"

export function WishlistContent() {
  const { 
    wishlistItems, 
    removeFromWishlist, 
    fetchWishlist, 
    isLoading 
  } = useWishlist()
  
  const { toast } = useToast()

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const handleRemoveFromWishlist = async (wishlistItemId: string, productName: string) => {
    try {
      await removeFromWishlist(wishlistItemId)
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist.`,
      })
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading && wishlistItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-elegant text-foreground mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-6">Save items you love to your wishlist and shop them later.</p>
        <Button asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Start Shopping
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-elegant text-foreground">Your Wishlist</h1>
        <p className="text-muted-foreground">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item._id} className="overflow-hidden group">
            <div className="relative aspect-square">
              <Image
                src={item.product.images?.[0] || '/placeholder.svg'}
                alt={item.product.name}
                fill
                className="object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/90 hover:bg-white"
                  onClick={() => handleRemoveFromWishlist(item._id, item.product.name)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-foreground line-clamp-2">
                  {item.product.name}
                </h3>
                <div className="font-medium text-foreground ml-2 whitespace-nowrap">
                  {formatCurrencyINR(item.product.price)}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <AddToCartButton
                  productId={item.product._id}
                  productName={item.product.name}
                  inStock={item.product.inStock}
                  size="sm"
                  className="flex-1 mr-2"
                />
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/products/${item.product._id}`}>
                    <span className="sr-only">View details</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

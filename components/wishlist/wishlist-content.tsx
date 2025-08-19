"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { AddToCartButton } from "@/components/product/add-to-cart-button"

export function WishlistContent() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { toast } = useToast()

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId)
    toast({
      title: "Removed from wishlist",
      description: `${productName} has been removed from your wishlist.`,
    })
  }

  // Add to cart handled by AddToCartButton component

  const handleClearWishlist = () => {
    clearWishlist()
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    })
  }

  if (wishlist.items.length === 0) {
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-elegant text-foreground">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlist.itemCount} items saved</p>
        </div>
        <Button variant="outline" onClick={handleClearWishlist}>
          Clear Wishlist
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.items.map((item) => {
          const discountPercentage = item.originalPrice
            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
            : 0

          return (
            <Card key={item.id} className="group overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <Link href={`/products/${item.productId}`}>
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                {discountPercentage > 0 && (
                  <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                    -{discountPercentage}%
                  </Badge>
                )}
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background text-red-500"
                  onClick={() => handleRemoveFromWishlist(item.productId, item.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-4">
                <Link href={`/products/${item.productId}`}>
                  <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 mb-2">
                    {item.name}
                  </h3>
                </Link>

                <div className="text-sm text-muted-foreground space-y-1 mb-3">
                  <p>Material: {item.material}</p>
                  <p>Color: {item.color}</p>
                  {item.size && <p>Size: {item.size}</p>}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-semibold text-foreground">${item.price}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
                  )}
                </div>

                <AddToCartButton
                  className="w-full"
                  size="sm"
                  productId={item.productId}
                  productName={item.name}
                  inStock={item.inStock}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

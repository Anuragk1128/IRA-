"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Star } from "lucide-react"
import Link from "next/link"
import { addToCartAPI } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"

const products = [
  {
    id: 1,
    name: "Rose Gold Elegance Necklace",
    price: 89,
    originalPrice: 129,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder-avw6e.png",
    isNew: true,
    isFavorite: false,
  },
  {
    id: 2,
    name: "Crystal Drop Earrings",
    price: 45,
    originalPrice: 65,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder-q7w90.png",
    isNew: false,
    isFavorite: true,
  },
  {
    id: 3,
    name: "Vintage Pearl Bracelet",
    price: 67,
    originalPrice: 95,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder-67ym3.png",
    isNew: false,
    isFavorite: false,
  },
  {
    id: 4,
    name: "Diamond-Style Ring Set",
    price: 78,
    originalPrice: 110,
    rating: 4.9,
    reviews: 203,
    image: "/placeholder-mog2r.png",
    isNew: true,
    isFavorite: false,
  },
]

export function ProductShowcase() {
  const { toast } = useToast()
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-3 mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-elegant font-bold">
            Bestselling <span className="text-gradient">Pieces</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Discover why these stunning pieces are loved by thousands of customers worldwide
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 md:gap-4 justify-items-center items-stretch max-w-[60rem] mx-auto">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="w-full max-w-[14rem] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Card className="group h-full w-full overflow-hidden rounded-lg border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 bg-card">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="relative aspect-[5/6] overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                      {product.isNew && (
                        <span className="bg-accent text-accent-foreground text-[11px] px-1.5 py-0.5 rounded-full font-medium">
                          New
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div
                    className="absolute top-1.5 right-1.5 flex flex-col gap-1.5 z-10 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`h-6 w-6 ${product.isFavorite ? "text-red-500" : ""}`}
                    >
                      <Heart className="h-3 w-3" fill={product.isFavorite ? "currentColor" : "none"} />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-6 w-6"
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        try {
                          await addToCartAPI({ productId: String(product.id), quantity: 1 })
                          toast({ title: "Added to cart", description: `${product.name} was added to your cart.` })
                        } catch (err) {
                          toast({
                            title: "Failed to add to cart",
                            description: err instanceof Error ? err.message : "Please try again",
                            variant: "destructive",
                          })
                        }
                      }}
                    >
                      <ShoppingBag className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Quick add button */}
                  <div
                    className="absolute bottom-1.5 left-1.5 right-1.5 z-10 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Button
                      size="sm"
                      className="w-full h-7 text-[13px]"
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        try {
                          await addToCartAPI({ productId: String(product.id), quantity: 1 })
                          toast({ title: "Added to cart", description: `${product.name} was added to your cart.` })
                        } catch (err) {
                          toast({
                            title: "Failed to add to cart",
                            description: err instanceof Error ? err.message : "Please try again",
                            variant: "destructive",
                          })
                        }
                      }}
                    >
                      Quick Add
                    </Button>
                  </div>
                </div>

                <div className="p-2.5 space-y-1.5">
                  <div>
                    <h3 className="font-medium text-[12px] md:text-[13px] mb-0.5 line-clamp-2 leading-snug">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] md:text-[11px] text-muted-foreground ml-1">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[13px] md:text-sm font-bold text-primary">${product.price}</span>
                    <span className="text-[10px] md:text-[11px] text-muted-foreground line-through">${product.originalPrice}</span>
                    <span className="text-[9px] md:text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                  </div>
                </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

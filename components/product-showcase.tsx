import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Star } from "lucide-react"

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
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-elegant font-bold">
            Bestselling <span className="text-gradient">Pieces</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover why these stunning pieces are loved by thousands of customers worldwide
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card"
            >
              <CardContent className="p-0">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                        New
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`h-8 w-8 ${product.isFavorite ? "text-red-500" : ""}`}
                    >
                      <Heart className="h-4 w-4" fill={product.isFavorite ? "currentColor" : "none"} />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick add button */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="w-full">
                      Quick Add
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground ml-1">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}

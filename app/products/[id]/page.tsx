import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { getProductById, getProductsByCategory } from "@/lib/products"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  -{discountPercentage}% OFF
                </Badge>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-elegant text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                {product.bestseller && <Badge variant="secondary">Bestseller</Badge>}
                {product.newArrival && <Badge className="bg-primary text-primary-foreground">New Arrival</Badge>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Material:</span>
                <span className="ml-2 text-muted-foreground">{product.material}</span>
              </div>
              <div>
                <span className="font-medium">Color:</span>
                <span className="ml-2 text-muted-foreground">{product.color}</span>
              </div>
              {product.size && (
                <div>
                  <span className="font-medium">Size:</span>
                  <span className="ml-2 text-muted-foreground">{product.size}</span>
                </div>
              )}
              <div>
                <span className="font-medium">Stock:</span>
                <span className={`ml-2 ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" size="lg" disabled={!product.inStock}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                This exquisite piece is crafted with attention to detail and quality materials. Perfect for both
                everyday wear and special occasions, it adds a touch of elegance to any outfit. Our artificial jewelry
                is designed to provide the luxury look without the premium price.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Material:</span>
                  <span className="text-muted-foreground">{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Color:</span>
                  <span className="text-muted-foreground">{product.color}</span>
                </div>
                {product.size && (
                  <div className="flex justify-between">
                    <span className="font-medium">Size:</span>
                    <span className="text-muted-foreground">{product.size}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <span className="text-muted-foreground capitalize">{product.category}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">Based on {product.reviewCount} reviews</span>
              </div>
              <p className="text-muted-foreground">
                Customer reviews will be displayed here. This section would typically include individual review cards
                with ratings, comments, and reviewer information.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <ProductGrid products={relatedProducts} title="Related Products" />
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

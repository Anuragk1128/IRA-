import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { AddToCartButton } from "@/components/product/add-to-cart-button"
import { formatCurrencyINR } from "@/lib/currency"
import { fetchProductByIdFromBackend, fetchProductsByCategory } from "@/lib/api"
import { fetchCategoriesFromApi } from "@/lib/catalog"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, categories] = await Promise.all([
    fetchProductByIdFromBackend(params.id),
    fetchCategoriesFromApi()
  ])

  if (!product) {
    notFound()
  }

  // Use the category and subcategory names directly from the backend data
  const categoryName = product.category
  const subcategoryName = product.subcategory || ''
  
  const relatedProducts = product.categoryId
    ? (await fetchProductsByCategory({ categoryId: product.categoryId })).filter((p) => p.id !== product.id).slice(0, 4)
    : []

  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
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
              <span className="text-3xl font-bold text-foreground">{formatCurrencyINR(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through">{formatCurrencyINR(product.compareAtPrice)}</span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-2 text-muted-foreground capitalize">
                    {categoryName}
                    {subcategoryName ? ` > ${subcategoryName}` : ''}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Material:</span>
                  <span className="ml-2 text-muted-foreground">{product.material || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium">Color:</span>
                  <span className="ml-2 text-muted-foreground">{product.color || 'N/A'}</span>
                </div>
                {product.size && (
                  <div>
                    <span className="font-medium">Size:</span>
                    <span className="ml-2 text-muted-foreground">{product.size}</span>
                  </div>
                )}
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Stock Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.inStock 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <AddToCartButton
                className="flex-1"
                size="lg"
                productId={product.id}
                productName={product.name}
                inStock={product.inStock}
              />
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
              <p className="text-muted-foreground leading-relaxed font-bold">{product.description}</p>
              <p className="text-muted-foreground leading-relaxed font-bold"> Products included :
              {product.tags?.join(', ') || 'N/A'}</p>
              <h2 className="text-xl font-bold mt-4">Features</h2>
              <p className="text-muted-foreground leading-relaxed ">
              Anti-tarnish</p>
              <p>Premium materials</p>
              <p>Superior design</p>
              
              <p>
                Easy Maintenance
              </p>
              <p>
                Travel Friendly
              </p>
              <h2 className="text-xl font-bold mt-4">Returns</h2>
              <p>
              
              We provide a reliable 7-day replacement policy that ensures a smooth and worry-free shopping experience.
                
              </p>
              <h2 className="text-xl font-bold mt-4">Care Instruction</h2>
              <p>
              Remove jewellery before washing hands, swimming, or showering.
              </p>
              <p>Due to its delicate nature, avoid wearing it during strenuous activities or while sleeping to reduce the risk of damage.</p>
              <p>Use a soft, dry microfibre cloth to gently remove dirt, sweat, and oils after each wear.</p>
              <p>Avoid using abrasive materials, ultrasonic cleaners, alcohol, or strong detergents, which can strip away finishes or discolour stones.</p>
              <p>Do not soak costume jewellery in water or cleaning solutions, as the glue or coatings may loosen or dissolve.</p>
              <p>To prevent tangling, scratches, or chipped coatings, store each piece in its own compartment, soft pouch, or a jewellery box with fabric lining.</p>
              
              
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Material:</span>
                    <span className="text-muted-foreground">{product.material || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Color:</span>
                    <span className="text-muted-foreground">{product.color || 'N/A'}</span>
                  </div>
                  {product.size && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Size:</span>
                      <span className="text-muted-foreground">{product.size}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Category:</span>
                    <span className="text-muted-foreground capitalize">
                      {categoryName}
                      {subcategoryName ? ` > ${subcategoryName}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Stock Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.inStock 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
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

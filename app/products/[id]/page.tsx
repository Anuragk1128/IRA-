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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
                <span>6 Months Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span>Easy Replacements</span>
              </div>
            </div>
            <div className="mb-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger className="text-lg font-bold">Description</AccordionTrigger>
              <AccordionContent>
                <div className="prose max-w-none">
                  {product.description && (
                    <>
                      <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                      <div className="h-px bg-gray-200 my-4"></div>
                    </>
                  )}
                  
                  {/* Display product attributes if they exist */}
                  {Object.entries(product).some(([key, value]) => 
                    ['material', 'color', 'size', 'weight', 'dimensions', 'Styling', 'occasion'].includes(key) && 
                    value && 
                    typeof value === 'string' && 
                    value.trim() !== ''
                  ) && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-3">Product Details</h2>
                      <div className="grid gap-2">
                        {Object.entries(product).map(([key, value]) => {
                          // Skip if value is empty, not a string, or not in our list of attributes to display
                          if (!value || typeof value !== 'string' || value.trim() === '' || 
                              !['material', 'color', 'size', 'weight', 'dimensions', 'style', 'occasion'].includes(key)) {
                            return null;
                          }
                          
                          // Format the key for display (capitalize first letter and add space before capital letters)
                          const displayKey = key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase())
                            .trim();
                            
                          return (
                            <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                              <span className="font-medium text-gray-700">{displayKey}:</span>
                              <span className="text-gray-600">{value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h2 className="text-xl font-bold mb-3">Replacements</h2>
                    <p className="text-muted-foreground">
                      We provide a reliable 7-day replacement policy that ensures a smooth and worry-free shopping experience.
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <h2 className="text-xl font-bold mb-3">Care Instructions</h2>
                    <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                      <li>Remove jewellery before washing hands, swimming, or showering.</li>
                      <li>Due to its delicate nature, avoid wearing it during strenuous activities or while sleeping.</li>
                      <li>Use a soft, dry microfibre cloth to gently remove dirt, sweat, and oils after each wear.</li>
                      <li>Avoid using abrasive materials, ultrasonic cleaners, alcohol, or strong detergents.</li>
                      <li>Do not soak jewellery in water or cleaning solutions.</li>
                      <li>Store each piece separately to prevent tangling and scratches.</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="specifications">
              <AccordionTrigger className="text-lg font-bold">Specifications</AccordionTrigger>
              <AccordionContent>
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="reviews">
              <AccordionTrigger className="text-lg font-bold">Reviews</AccordionTrigger>
              <AccordionContent>
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
          </div>
        </div>

    

       
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((relatedProduct) => (
                <div key={relatedProduct.id} className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                  <a href={`/products/${relatedProduct.id}`} className="block">
                    <div className="aspect-square relative bg-gray-50">
                      <Image
                        src={relatedProduct.images[0] || '/placeholder.svg'}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:opacity-90 transition-opacity"
                      />
                      {relatedProduct.compareAtPrice && relatedProduct.compareAtPrice > relatedProduct.price && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          -{Math.round(((relatedProduct.compareAtPrice - relatedProduct.price) / relatedProduct.compareAtPrice) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{relatedProduct.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= Math.floor(relatedProduct.rating) 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({relatedProduct.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {formatCurrencyINR(relatedProduct.price)}
                        </span>
                        {relatedProduct.compareAtPrice && relatedProduct.compareAtPrice > relatedProduct.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrencyINR(relatedProduct.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

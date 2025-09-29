"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import { useState, useEffect, use } from "react"
import { Star, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react"
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
import { ReviewsPanel } from "@/components/product/reviews-panel"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoriesData] = await Promise.all([
          fetchProductByIdFromBackend(resolvedParams.id),
          fetchCategoriesFromApi()
        ])
        
        if (!productData) {
          notFound()
        }
        
        setProduct(productData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching product data:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [resolvedParams.id])

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      if (product?.categoryId) {
        try {
          const products = await fetchProductsByCategory({ categoryId: product.categoryId })
          setRelatedProducts(products.filter((p) => p.id !== product.id).slice(0, 4))
        } catch (error) {
          setRelatedProducts([])
        }
      }
    }
    if (product) fetchRelated()
  }, [product])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPreviewOpen) return
      
      switch (e.key) {
        case 'Escape':
          closePreview()
          break
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isPreviewOpen])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!product) {
    notFound()
  }

  // Image navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const openPreview = () => {
    setIsPreviewOpen(true)
    setZoom(1)
  }

  const closePreview = () => {
    setIsPreviewOpen(false)
    setZoom(1)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5))
  }

  // Prefer display labels when available
  const categoryName = product.categoryLabel || product.category
  const subcategoryName = product.subcategoryLabel || product.subcategory || ''
  const materialDisplay = (() => {
    const primary = typeof product.material === 'string' ? product.material : ''
    const fallback = typeof product.attributes?.material === 'string' ? product.attributes.material : ''
    const pick = primary && primary.toLowerCase() !== 'string' ? primary : fallback
    return pick && pick.toLowerCase() !== 'string' ? pick : 'N/A'
  })()

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
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer" onClick={openPreview}>
              <Image
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage()
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage()
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                {/* Discount Badge */}
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  -{discountPercentage}% OFF
                </Badge>
              )}
                
                {/* Image Counter */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}
            </div>
              
              {/* Thumbnail Images */}
            {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image: string, index: number) => (
                    <div 
                      key={index} 
                      className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer border-2 transition-colors ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => selectImage(index)}
                    >
                    <Image
                      src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
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
                  
                </div>
                {product.bestseller && <Badge variant="secondary">Bestseller</Badge>}
                {product.newArrival && <Badge className="bg-primary text-primary-foreground">New Arrival</Badge>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                {product.priceIncludingTax ? formatCurrencyINR(product.priceIncludingTax) : formatCurrencyINR(product.price)}
              </span>
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
                  {product.attributes?.styling && (
                    <div>
                      <h2 className="text-xl font-bold mb-3 mt-2">Styling Tip:</h2>
                      <p className="text-muted-foreground">
                        {product.attributes.styling}
                      </p>
                    </div>
                  )}
                  
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
                  <div className="flex justify-center">
                    <div className="w-full max-w-md space-y-4">
                      <div className="flex items-center justify-between gap-6 py-2 border-b">
                        <span className="font-medium">Material:</span>
                        <span className="text-muted-foreground"> {product.material}</span>
                      </div>
                      <div className="flex items-center justify-between gap-6 py-2 border-b">
                        <span className="font-medium">Color:</span>
                        <span className="text-muted-foreground">{product.color || 'N/A'}</span>
                      </div>
                     
                      {product.size && (
                        <div className="flex items-center justify-between gap-6 py-2 border-b">
                          <span className="font-medium">Size:</span>
                          <span className="text-muted-foreground">{product.size}</span>
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-6 py-2 border-b">
                        <span className="font-medium"> Features: </span>
                        <span className="text-muted-foreground">
                          Water-proof <br/>
                          Premium Material <br/>
                          Superior Design <br/>
                          Easy Maintenance <br/>
                          Travel Friendly

                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-6 py-2 border-b">
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
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Customer reviews will be displayed here. This section would typically include individual review cards
                    with ratings, comments, and reviewer information.
                  </p>

                  {/* User-submitted reviews (local only) */}
                  <ReviewsPanel productId={product.id} />
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
                          {relatedProduct.priceIncludingTax ? formatCurrencyINR(relatedProduct.priceIncludingTax) : formatCurrencyINR(relatedProduct.price)}
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
        
        {/* Image Preview Modal */}
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closePreview}>
            <div className="relative max-w-6xl max-h-full w-full h-full flex flex-col">
              {/* Header Controls */}
              <div className="flex justify-between items-center p-4 bg-black/50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  <span className="text-white text-sm">{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={closePreview}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Main Image Container */}
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="relative max-w-full max-h-full">
                  <Image
                    src={product.images[currentImageIndex] || "/placeholder.svg"}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                  />
                  
                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex justify-center p-4 bg-black/50">
                  <div className="flex gap-2 max-w-full overflow-x-auto">
                    {product.images.map((image: string, index: number) => (
                      <div 
                        key={index} 
                        className={`relative w-16 h-16 overflow-hidden rounded-lg cursor-pointer border-2 flex-shrink-0 transition-colors ${
                          index === currentImageIndex ? 'border-white' : 'border-transparent hover:border-gray-400'
                        }`}
                        onClick={() => selectImage(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { AddToCartButton } from "@/components/product/add-to-cart-button"
import { Product } from "@/types/product"
import { mockProducts } from "@/lib/mockData"

// Use local mock data instead of backend
function getFeaturedProducts(): Product[] {
  return mockProducts.filter(p => p.featured)
}

export function ProductShowcase() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        // Load from mock data
        const featuredProducts = getFeaturedProducts()
        setProducts(featuredProducts)
      } catch (error) {
        console.error('Error loading products:', error)
        toast({
          title: "Error",
          description: "Failed to load featured products. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [toast])

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700">No featured products available</h2>
            <p className="text-gray-500 mt-2">Check back later for our featured collection</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-10 md:py-16">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center space-y-2.5 sm:space-y-3 mb-8 sm:mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Featured <span className="text-primary">Products</span>
          </h2>
          <p className="text-sm sm:text-[15px] md:text-base text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium jewelry
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => {
            const discount = product.originalPrice && product.originalPrice > 0
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0
              
            return (
              <Card key={product.id} className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    
                    {discount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        -{discount}%
                      </span>
                    )}
                    
                    {product.newArrival && (
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        New
                      </span>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-2">
                        ({product.reviewCount || 0} reviews)
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-10">
                      {product.name}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Link>
                <div className="px-4 pb-4">
                  <Button asChild variant="default" className="w-full">
                    <Link href={`/products/${product.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/products">
              View All Products
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

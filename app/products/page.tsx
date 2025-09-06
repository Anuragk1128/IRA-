"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { fetchAllProductsFromBackend, clearProductsCache } from "@/lib/api"
import { Product } from "@/types/product"
import { Loader2 } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        // Clear cache to ensure fresh data from the new endpoint
        clearProductsCache()
        const backendProducts = await fetchAllProductsFromBackend()
        setProducts(backendProducts)
      } catch (err) {
        console.error('Error loading products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-elegant text-foreground mb-2">All Products</h1>
            <p className="text-red-500">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-elegant text-foreground mb-2">All Products</h1>
          <p className="text-muted-foreground">Discover our complete collection of elegant artificial jewellery</p>
        </div>
        <ProductGrid products={products} />
      </main>
      <Footer />
    </div>
  )
}

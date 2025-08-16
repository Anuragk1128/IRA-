import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/products"

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-elegant text-foreground mb-2">All Products</h1>
          <p className="text-muted-foreground">Discover our complete collection of elegant artificial jewelry</p>
        </div>
        <ProductGrid products={products} />
      </main>
      <Footer />
    </div>
  )
}

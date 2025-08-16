import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCollections } from "@/components/featured-collections"
import { ProductShowcase } from "@/components/product-showcase"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedCollections />
        <ProductShowcase />
      </main>
      <Footer />
    </div>
  )
}

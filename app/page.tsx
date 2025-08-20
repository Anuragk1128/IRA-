import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCollections } from "@/components/featured-collections"
import { ProductShowcase } from "@/components/product-showcase"
import { Footer } from "@/components/footer"
import { Reels } from "@/components/reels"
import { Newsletter } from "@/components/newsletter"
import BrandStory from "@/components/brandstory"
import { SocialProof } from "@/components/social-proof"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedCollections />
        
        <Reels />
        <ProductShowcase />
        <BrandStory />
        <Newsletter/>
        <SocialProof />
        
      </main>
      <Footer />
    </div>
  )
}

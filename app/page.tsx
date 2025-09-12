import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCollections } from "@/components/featured-collections"
import { ProductShowcase } from "@/components/product-showcase-clean"
import { Footer } from "@/components/footer"
import { Reels } from "@/components/reels"
import { Newsletter } from "@/components/newsletter"
import BrandStory from "@/components/brandstory"
import { SocialProof } from "@/components/social-proof"
import Sale  from "@/components/sale"
import PopularSearches from "@/components/popular-search"
import ThemeRotator from "@/components/theme-rotator"
import Blogs from "@/components/blogs"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <ThemeRotator />
      <Header />
      <Sale />
      <main>
        <div id="hero-sentinel" className="h-px w-full" />
        <HeroSection />
        <FeaturedCollections />
        
        <Reels />
        <ProductShowcase/>
        <Blogs/>
        <BrandStory />
        <Newsletter/>
        <SocialProof />
        
      </main>
      <Footer />
      <PopularSearches/>
    </div>
  )
}

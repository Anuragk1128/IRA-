import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoryContent } from "@/components/category/category-content"
import { fetchCategoriesFromApi, fetchBrandSubcategories } from "@/lib/catalog"
import type { ProductCategory } from "@/types/product"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

function toSlug(s?: string) {
  return (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const cats = await fetchCategoriesFromApi()
  const match = cats.find((c) => (c.slug || toSlug(c.name)) === params.slug)

  if (!match) {
    notFound()
  }

  // Fetch subcategories for this category from backend
  const brand = process.env.NEXT_PUBLIC_BRAND_SLUG || "ira"
  const subs = await fetchBrandSubcategories(brand, params.slug)

  const category: ProductCategory = {
    id: match!.id,
    name: match!.name,
    slug: match!.slug ?? toSlug(match!.name),
    description: match!.description || "",
    image: (match as any).image || "/placeholder.svg",
    subcategories: subs.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug ?? toSlug(s.name),
      description: s.description || "",
    })),
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CategoryContent category={category} />
      </main>
      <Footer />
    </div>
  )
}

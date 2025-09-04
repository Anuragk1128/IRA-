import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchCategoriesFromApi } from "@/lib/catalog"

function toSlug(s?: string) {
  return (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export default async function CategoriesPage() {
  const categories = await fetchCategoriesFromApi()
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-elegant text-foreground mb-2">Shop by Category</h1>
          <p className="text-muted-foreground">Explore our curated collections of artificial jewellery</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug ?? toSlug(category.name)}?catId=${category.id}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                <Image
                  src={(category as any).image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-xl font-elegant text-center">{category.name}</h3>
                </div>
              </div>
              {category.description && (
                <p className="text-muted-foreground text-sm text-center">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}


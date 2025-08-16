import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoryContent } from "@/components/category/category-content"
import { categories } from "@/lib/products"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find((cat) => cat.slug === params.slug)

  if (!category) {
    notFound()
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

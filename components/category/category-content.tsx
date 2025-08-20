"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { SearchFilters } from "@/components/search/search-filters"
import { SearchResults } from "@/components/search/search-results"
import { searchProducts } from "@/lib/search"
import type { ProductCategory } from "@/types/product"
import type { ProductFilters } from "@/types/filters"

interface CategoryContentProps {
  category: ProductCategory
}

export function CategoryContent({ category }: CategoryContentProps) {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<ProductFilters>({
    category: category.slug,
    sortBy: "name",
  })
  const [searchResult, setSearchResult] = useState(() =>
    searchProducts("", { category: category.slug, sortBy: "name" }),
  )

  useEffect(() => {
    const result = searchProducts("", filters)
    setSearchResult(result)
  }, [filters])

  // Initialize subcategory from URL (?sub=slug)
  useEffect(() => {
    const sub = searchParams.get("sub") || undefined
    setFilters((prev) => ({ ...prev, subcategory: sub }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters({ ...newFilters, category: category.slug })
  }

  const handleClearFilters = () => {
    setFilters({ category: category.slug, sortBy: "name" })
  }

  const handleSortChange = (sortBy: ProductFilters["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }

  const handleSubcategoryClick = (subcategorySlug: string) => {
    setFilters((prev) => ({ ...prev, subcategory: subcategorySlug }))
  }

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="relative h-56 md:h-64 rounded-xl overflow-hidden">
        <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-elegant mb-1.5 leading-tight">{category.name}</h1>
            <p className="text-base md:text-lg">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg md:text-xl font-medium">Shop by Style</h2>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, subcategory: undefined }))}
              className={`px-3 py-1.5 rounded-full text-xs md:text-sm transition-colors ${
                !filters.subcategory ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              All {category.name}
            </button>
            {category.subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory.slug)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm transition-colors ${
                  filters.subcategory === subcategory.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters
            filterGroups={searchResult.filters}
            appliedFilters={searchResult.appliedFilters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          <SearchResults
            products={searchResult.products}
            totalCount={searchResult.totalCount}
            appliedFilters={searchResult.appliedFilters}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
    </div>
  )
}

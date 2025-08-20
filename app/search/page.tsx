"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search/search-bar"
import { SearchFilters } from "@/components/search/search-filters"
import { SearchResults } from "@/components/search/search-results"
import { searchProducts } from "@/lib/search"
import type { ProductFilters } from "@/types/filters"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialCategory = searchParams.get("category") || undefined

  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<ProductFilters>({
    category: initialCategory,
    sortBy: "name",
  })
  const [searchResult, setSearchResult] = useState(() =>
    searchProducts(initialQuery, { ...filters, category: initialCategory }),
  )

  useEffect(() => {
    const result = searchProducts(query, filters)
    setSearchResult(result)
  }, [query, filters])

  // Keep local state in sync with URL search params when they change (e.g., new search from Header)
  useEffect(() => {
    const nextQuery = searchParams.get("q") || ""
    const nextCategory = searchParams.get("category") || undefined
    setQuery(nextQuery)
    setFilters((prev) => ({ ...prev, category: nextCategory }))
  }, [searchParams])

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
  }

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({ sortBy: "name" })
  }

  const handleSortChange = (sortBy: ProductFilters["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-elegant text-foreground mb-4">Search Products</h1>
          <div className="max-w-2xl">
            <SearchBar initialQuery={query} onSearch={handleSearch} showSuggestions={false} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              filterGroups={searchResult.filters}
              appliedFilters={searchResult.appliedFilters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <SearchResults
              products={searchResult.products}
              totalCount={searchResult.totalCount}
              appliedFilters={searchResult.appliedFilters}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

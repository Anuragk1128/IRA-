"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { SearchFilters } from "@/components/search/search-filters"
import { SearchResults } from "@/components/search/search-results"
import type { ProductCategory } from "@/types/product"
import type { ProductFilters } from "@/types/filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import { fetchBrandCategoryProducts, fetchProductsFromApi, fetchProductsByCategory, applyClientFiltersAndSort, generateFilterGroupsFor, isBackendId } from "@/lib/api"

interface CategoryContentProps {
  category: ProductCategory
}

export function CategoryContent({ category }: CategoryContentProps) {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<ProductFilters>(() => ({
    // default to local category id; can be overridden by URL-provided backend id
    category: category.id,
    sortBy: "name",
  }))
  const [searchResult, setSearchResult] = useState({
    products: [] as ReturnType<typeof applyClientFiltersAndSort>,
    totalCount: 0,
    filters: [] as ReturnType<typeof generateFilterGroupsFor>,
    appliedFilters: { category: category.id, sortBy: "name" } as ProductFilters,
    suggestions: [] as string[],
  })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // Determine selected subcategory slug from the provided category model
        const selectedSubSlug = filters.subcategory
          ? category.subcategories?.find((s) => s.id === filters.subcategory)?.slug
          : undefined
        // Always use new backend by category slug; if no subcategory selected, it aggregates all subs
        const apiProducts = await fetchBrandCategoryProducts(category.slug, selectedSubSlug)

        const filtered = applyClientFiltersAndSort(apiProducts, filters)
        const filterGroups = generateFilterGroupsFor(apiProducts, filtered)
        if (!mounted) return
        setSearchResult({
          products: filtered,
          totalCount: filtered.length,
          filters: filterGroups,
          appliedFilters: filters,
          suggestions: [],
        })
      } catch (e) {
        if (!mounted) return
        setSearchResult({ products: [], totalCount: 0, filters: [], appliedFilters: filters, suggestions: [] })
      }
    })()
    return () => {
      mounted = false
    }
  }, [filters])

  // Initialize category/subcategory and price range from URL when provided
  useEffect(() => {
    const catIdParam = searchParams.get("catId") || undefined
    const subIdParam = searchParams.get("subId") || searchParams.get("sub") || undefined
    const minParam = searchParams.get("min")
    const maxParam = searchParams.get("max")
    const min = minParam !== null ? Number(minParam) : undefined
    const max = maxParam !== null ? Number(maxParam) : undefined
    setFilters((prev) => ({
      ...prev,
      category: catIdParam && isBackendId(catIdParam) ? catIdParam : prev.category,
      subcategory: subIdParam && isBackendId(subIdParam) ? subIdParam : prev.subcategory,
      priceRange:
        typeof min === "number" && !Number.isNaN(min)
          ? [min, typeof max === "number" && !Number.isNaN(max) ? max : Number.MAX_SAFE_INTEGER]
          : undefined,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleFiltersChange = (newFilters: ProductFilters) => {
    // Always enforce current category id
    setFilters({ ...newFilters, category: category.id })
  }

  const handleClearFilters = () => {
    setFilters({ category: category.id, sortBy: "name" })
  }

  const handleSortChange = (sortBy: ProductFilters["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }

  const handleSubcategoryClick = (subcategoryId: string) => {
    setFilters((prev) => ({ ...prev, subcategory: subcategoryId }))
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.materials?.length) count += filters.materials.length
    if (filters.colors?.length) count += filters.colors.length
    if (filters.sizes?.length) count += filters.sizes.length
    if (filters.rating) count += 1
    if (filters.priceRange) count += 1
    if (filters.inStock) count += 1
    if (filters.subcategory) count += 1
    return count
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
                onClick={() => handleSubcategoryClick(subcategory.id)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm transition-colors ${
                  filters.subcategory === subcategory.id
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

      {/* Mobile filters trigger */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && <Badge variant="secondary">{getActiveFilterCount()}</Badge>}
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="p-4 overflow-y-auto">
              <SearchFilters
                filterGroups={searchResult.filters}
                appliedFilters={searchResult.appliedFilters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button className="w-full">Done</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
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
            categoryName={category.name}
          />
        </div>
      </div>
    </div>
  )
}

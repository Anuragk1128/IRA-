"use client"

import { useState } from "react"
import { Grid, List, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/types/product"
import type { ProductFilters } from "@/types/filters"

interface SearchResultsProps {
  products: Product[]
  totalCount: number
  appliedFilters: ProductFilters
  onSortChange: (sortBy: ProductFilters["sortBy"]) => void
}

export function SearchResults({ products, totalCount, appliedFilters, onSortChange }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const handleSortChange = (value: string) => {
    onSortChange(value as ProductFilters["sortBy"])
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">
            {totalCount} {totalCount === 1 ? "Product" : "Products"} Found
          </h2>
          {appliedFilters.category && (
            <p className="text-sm text-muted-foreground capitalize">in {appliedFilters.category.replace("-", " ")}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <Select value={appliedFilters.sortBy || "name"} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="bestseller">Best Sellers</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold">${product.price}</span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

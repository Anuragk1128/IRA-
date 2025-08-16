import type { Product } from "./product" // Assuming Product is declared in another file

export interface ProductFilters {
  category?: string
  subcategory?: string
  priceRange?: [number, number]
  materials?: string[]
  colors?: string[]
  sizes?: string[]
  inStock?: boolean
  rating?: number
  tags?: string[]
  sortBy?: "name" | "price-low" | "price-high" | "rating" | "newest" | "bestseller"
}

export interface FilterOption {
  value: string
  label: string
  count: number
}

export interface FilterGroup {
  id: string
  name: string
  options: FilterOption[]
  type: "checkbox" | "radio" | "range"
}

export interface SearchResult {
  products: Product[]
  totalCount: number
  filters: FilterGroup[]
  appliedFilters: ProductFilters
  suggestions?: string[]
}

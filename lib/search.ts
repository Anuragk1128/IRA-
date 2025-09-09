import type { Product } from "@/types/product"
import type { ProductFilters, FilterGroup, SearchResult } from "@/types/filters"
import { fetchAllProductsFromBackend } from "@/lib/api"

export async function searchProducts(query = "", filters: ProductFilters = {}): Promise<SearchResult> {
  // Build inferred filters from the free-text query (category, subcategory, price range)
  const inferred = inferFiltersFromQuery(query)
  // Do not override explicit filters passed in
  const effectiveFilters: ProductFilters = {
    ...filters,
    category: filters.category ?? inferred.category,
    subcategory: filters.subcategory ?? inferred.subcategory,
    priceRange: filters.priceRange ?? inferred.priceRange,
  }

  // Fetch products from backend
  const products = await fetchAllProductsFromBackend()
  let filteredProducts = [...products]

  // Helpers to normalize/guard
  const toLower = (s?: string) => (s || "").toLowerCase()
  const ensureArray = (v: any): string[] => (Array.isArray(v) ? v : (v ? [v] : []))

  // Text search (also includes category and subcategory label matches)
  if (query.trim()) {
    const searchTerm = query.toLowerCase()
    filteredProducts = filteredProducts.filter((product) => {
      const name = toLower(product.name)
      const description = toLower(product.description)
      const tags = ensureArray(product.tags).map(toLower)
      const material = toLower((product as any).material)
      const colors = ensureArray((product as any).color).map(toLower)
      return (
        name.includes(searchTerm) ||
        description.includes(searchTerm) ||
        tags.some((tag) => tag.includes(searchTerm)) ||
        material.includes(searchTerm) ||
        colors.some((c) => c.includes(searchTerm))
      )
    })
  }

  // Apply filters
  if (effectiveFilters.category) {
    const wanted = effectiveFilters.category
    filteredProducts = filteredProducts.filter((product: any) => product.category === wanted || product.categoryId === wanted)
  }

  if (effectiveFilters.subcategory) {
    const wanted = effectiveFilters.subcategory
    filteredProducts = filteredProducts.filter((product: any) => product.subcategory === wanted || product.subcategoryId === wanted)
  }

  if (effectiveFilters.priceRange) {
    const [min, max] = effectiveFilters.priceRange
    filteredProducts = filteredProducts.filter((product) => product.price >= min && product.price <= max)
  }

  if (effectiveFilters.materials && effectiveFilters.materials.length > 0) {
    const set = new Set(effectiveFilters.materials.map((m) => m.toLowerCase()))
    filteredProducts = filteredProducts.filter((product: any) => set.has(String(product.material || "").toLowerCase()))
  }

  if (effectiveFilters.colors && effectiveFilters.colors.length > 0) {
    const set = new Set(effectiveFilters.colors.map((c) => c.toLowerCase()))
    filteredProducts = filteredProducts.filter((product: any) => {
      const colors = ensureArray(product.color).map((c) => String(c).toLowerCase())
      return colors.some((c) => set.has(c))
    })
  }

  if (effectiveFilters.sizes && effectiveFilters.sizes.length > 0) {
    const set = new Set(effectiveFilters.sizes.map((s) => s.toLowerCase()))
    filteredProducts = filteredProducts.filter((product: any) => {
      const sizes = ensureArray(product.size).map((s) => String(s).toLowerCase())
      return sizes.some((s) => set.has(s))
    })
  }

  if (effectiveFilters.inStock !== undefined) {
    filteredProducts = filteredProducts.filter((product) => product.inStock === effectiveFilters.inStock)
  }

  if (effectiveFilters.rating) {
    filteredProducts = filteredProducts.filter((product) => product.rating >= effectiveFilters.rating!)
  }

  if (effectiveFilters.tags && effectiveFilters.tags.length > 0) {
    filteredProducts = filteredProducts.filter((product) => effectiveFilters.tags!.some((tag) => product.tags.includes(tag)))
  }

  // Apply sorting
  if (effectiveFilters.sortBy) {
    switch (effectiveFilters.sortBy) {
      case "name":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filteredProducts.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0))
        break
      case "bestseller":
        filteredProducts.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0))
        break
    }
  }

  // Generate filter groups based on current results
  const filterGroups = await generateFilterGroups(products, filteredProducts)

  return {
    products: filteredProducts,
    totalCount: filteredProducts.length,
    filters: filterGroups,
    appliedFilters: effectiveFilters,
    suggestions: generateSearchSuggestions(query, products),
  }
}

async function generateFilterGroups(allProducts: Product[], filteredProducts: Product[]): Promise<FilterGroup[]> {
  const materialCounts = new Map<string, number>()
  const colorCounts = new Map<string, number>()
  const sizeCounts = new Map<string, number>()

  filteredProducts.forEach((product) => {
    materialCounts.set(product.material, (materialCounts.get(product.material) || 0) + 1)
    colorCounts.set(product.color, (colorCounts.get(product.color) || 0) + 1)
    if (product.size) {
      sizeCounts.set(product.size, (sizeCounts.get(product.size) || 0) + 1)
    }
  })

  // Generate dynamic price ranges based on actual product prices
  const prices = filteredProducts.map(p => p.price).sort((a, b) => a - b)
  const minPrice = Math.floor(prices[0] / 500) * 500 // Round down to nearest 500
  const maxPrice = Math.ceil(prices[prices.length - 1] / 500) * 500 // Round up to nearest 500
  
  const priceRanges = []
  for (let i = minPrice; i < maxPrice; i += 500) {
    const rangeStart = i
    const rangeEnd = i + 500
    const count = filteredProducts.filter(p => p.price >= rangeStart && p.price < rangeEnd).length
    if (count > 0) {
      priceRanges.push({
        value: `${rangeStart}-${rangeEnd}`,
        label: `₹${rangeStart.toLocaleString()} - ₹${rangeEnd.toLocaleString()}`,
        count
      })
    }
  }
  
  // Add the final range for the highest prices
  const finalRangeStart = maxPrice
  const finalCount = filteredProducts.filter(p => p.price >= finalRangeStart).length
  if (finalCount > 0) {
    priceRanges.push({
      value: `${finalRangeStart}+`,
      label: `₹${finalRangeStart.toLocaleString()}+`,
      count: finalCount
    })
  }

  return [
    {
      id: "materials",
      name: "Material",
      type: "checkbox",
      options: Array.from(materialCounts.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    },
    {
      id: "colors",
      name: "Color",
      type: "checkbox",
      options: Array.from(colorCounts.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    },
    {
      id: "sizes",
      name: "Size",
      type: "checkbox",
      options: Array.from(sizeCounts.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    },
    {
      id: "price",
      name: "Price Range",
      type: "range",
      options: priceRanges,
    },
    {
      id: "rating",
      name: "Customer Rating",
      type: "radio",
      options: [
        { value: "4", label: "4+ Stars", count: filteredProducts.filter((p) => p.rating >= 4).length },
        { value: "3", label: "3+ Stars", count: filteredProducts.filter((p) => p.rating >= 3).length },
        { value: "2", label: "2+ Stars", count: filteredProducts.filter((p) => p.rating >= 2).length },
      ],
    },
  ]
}

function generateSearchSuggestions(query: string, allProducts: Product[]): string[] {
  if (!query.trim()) return []

  const suggestions = new Set<string>()
  const searchTerm = query.toLowerCase()

  allProducts.forEach((product) => {
    // Add product names that start with the search term
    if (product.name.toLowerCase().startsWith(searchTerm)) {
      suggestions.add(product.name)
    }

    // Add materials and colors
    if (product.material.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.material)
    }
    if (product.color.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.color)
    }

    // Add tags
    product.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(searchTerm)) {
        suggestions.add(tag)
      }
    })
  })

  // Category-based suggestions removed (now backend-driven elsewhere)

  // Common price buckets
  const priceBuckets = ["Under $50", "$50 - $100", "$100 - $200", "$200+"]
  priceBuckets.forEach((label) => {
    if (label.toLowerCase().includes(searchTerm)) suggestions.add(label)
  })

  return Array.from(suggestions).slice(0, 5)
}

export function getPopularSearches(): string[] {
  return [
    "search for everyday elegance...",
    "search gifts for your dearest...",
    "search for necklaces...",
    "Experience elegance of old-school glam..."

  ]
}

// Helpers
function inferFiltersFromQuery(query: string): Pick<ProductFilters, "category" | "subcategory" | "priceRange"> {
  const q = query.toLowerCase()
  const result: Pick<ProductFilters, "category" | "subcategory" | "priceRange"> = {}

  // Category/subcategory inference removed (now backend IDs are used via URL params)

  // Price parsing: under/over/between and ranges like 50-100, 50 to 100, $, $ supported
  const normalized = q.replace(/[,$$]/g, "")
  const rangeDash = normalized.match(/(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)/)
  const rangeTo = normalized.match(/(\d+(?:\.\d+)?)\s*(?:to|and)\s*(\d+(?:\.\d+)?)/)
  const under = normalized.match(/(?:under|below|less than)\s*(\d+(?:\.\d+)?)/)
  const over = normalized.match(/(?:over|above|more than)\s*(\d+(?:\.\d+)?)/)

  const asNumber = (s: string) => parseFloat(s)

  if (rangeDash) {
    const min = asNumber(rangeDash[1])
    const max = asNumber(rangeDash[2])
    if (!Number.isNaN(min) && !Number.isNaN(max)) result.priceRange = [Math.min(min, max), Math.max(min, max)]
  } else if (rangeTo) {
    const min = asNumber(rangeTo[1])
    const max = asNumber(rangeTo[2])
    if (!Number.isNaN(min) && !Number.isNaN(max)) result.priceRange = [Math.min(min, max), Math.max(min, max)]
  } else if (under) {
    const max = asNumber(under[1])
    if (!Number.isNaN(max)) result.priceRange = [0, max]
  } else if (over) {
    const min = asNumber(over[1])
    if (!Number.isNaN(min)) result.priceRange = [min, Number.MAX_SAFE_INTEGER]
  }

  return result
}

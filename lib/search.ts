import type { Product } from "@/types/product"
import type { ProductFilters, FilterGroup, SearchResult } from "@/types/filters"
import { products, categories } from "@/lib/products"

export function searchProducts(query = "", filters: ProductFilters = {}): SearchResult {
  // Build inferred filters from the free-text query (category, subcategory, price range)
  const inferred = inferFiltersFromQuery(query)
  // Do not override explicit filters passed in
  const effectiveFilters: ProductFilters = {
    ...filters,
    category: filters.category ?? inferred.category,
    subcategory: filters.subcategory ?? inferred.subcategory,
    priceRange: filters.priceRange ?? inferred.priceRange,
  }

  let filteredProducts = [...products]

  // Text search (also includes category and subcategory label matches)
  if (query.trim()) {
    const searchTerm = query.toLowerCase()
    filteredProducts = filteredProducts.filter((product) => {
      const cat = categories.find((c) => c.slug === product.category)
      const sub = cat?.subcategories?.find((s) => s.slug === product.subcategory)
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        product.material.toLowerCase().includes(searchTerm) ||
        product.color.toLowerCase().includes(searchTerm) ||
        // category/subcategory label matches
        (!!cat && (cat.slug.includes(searchTerm) || cat.name.toLowerCase().includes(searchTerm))) ||
        (!!sub && (sub.slug.includes(searchTerm) || sub.name.toLowerCase().includes(searchTerm)))
      )
    })
  }

  // Apply filters
  if (effectiveFilters.category) {
    filteredProducts = filteredProducts.filter((product) => product.category === effectiveFilters.category)
  }

  if (effectiveFilters.subcategory) {
    filteredProducts = filteredProducts.filter((product) => product.subcategory === effectiveFilters.subcategory)
  }

  if (effectiveFilters.priceRange) {
    const [min, max] = effectiveFilters.priceRange
    filteredProducts = filteredProducts.filter((product) => product.price >= min && product.price <= max)
  }

  if (effectiveFilters.materials && effectiveFilters.materials.length > 0) {
    filteredProducts = filteredProducts.filter((product) => effectiveFilters.materials!.includes(product.material))
  }

  if (effectiveFilters.colors && effectiveFilters.colors.length > 0) {
    filteredProducts = filteredProducts.filter((product) => effectiveFilters.colors!.includes(product.color))
  }

  if (effectiveFilters.sizes && effectiveFilters.sizes.length > 0) {
    filteredProducts = filteredProducts.filter((product) => product.size && effectiveFilters.sizes!.includes(product.size))
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
  const filterGroups = generateFilterGroups(products, filteredProducts)

  return {
    products: filteredProducts,
    totalCount: filteredProducts.length,
    filters: filterGroups,
    appliedFilters: effectiveFilters,
    suggestions: generateSearchSuggestions(query, products),
  }
}

function generateFilterGroups(allProducts: Product[], filteredProducts: Product[]): FilterGroup[] {
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
      options: [
        { value: "0-50", label: "Under ₹50", count: filteredProducts.filter((p) => p.price < 50).length },
        {
          value: "50-100",
          label: "₹50 - ₹100",
          count: filteredProducts.filter((p) => p.price >= 50 && p.price < 100).length,
        },
        {
          value: "100-200",
          label: "₹100 - ₹200",
          count: filteredProducts.filter((p) => p.price >= 100 && p.price < 200).length,
        },
        { value: "200+", label: "₹200+", count: filteredProducts.filter((p) => p.price >= 200).length },
      ],
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

  // Add categories and subcategories
  categories.forEach((cat) => {
    if (cat.name.toLowerCase().startsWith(searchTerm) || cat.slug.startsWith(searchTerm)) {
      suggestions.add(cat.name)
    }
    cat.subcategories?.forEach((sub) => {
      if (sub.name.toLowerCase().startsWith(searchTerm) || sub.slug.startsWith(searchTerm)) {
        suggestions.add(sub.name)
      }
    })
  })

  // Common price buckets
  const priceBuckets = ["Under ₹50", "₹50 - ₹100", "₹100 - ₹200", "₹200+"]
  priceBuckets.forEach((label) => {
    if (label.toLowerCase().includes(searchTerm)) suggestions.add(label)
  })

  return Array.from(suggestions).slice(0, 5)
}

export function getPopularSearches(): string[] {
  return [
    "Rose Gold Necklace",
    "Diamond Earrings",
    "Pearl Bracelet",
    "Statement Ring",
    "Gold Jewelry",
    "Crystal Accessories",
    "Vintage Style",
    "Minimalist Design",
  ]
}

// Helpers
function inferFiltersFromQuery(query: string): Pick<ProductFilters, "category" | "subcategory" | "priceRange"> {
  const q = query.toLowerCase()
  const result: Pick<ProductFilters, "category" | "subcategory" | "priceRange"> = {}

  // Categories
  for (const cat of categories) {
    if (q.includes(cat.slug) || q.includes(cat.name.toLowerCase())) {
      result.category = cat.slug
      break
    }
  }

  // Subcategories
  if (result.category) {
    const cat = categories.find((c) => c.slug === result.category)
    for (const sub of cat?.subcategories || []) {
      if (q.includes(sub.slug) || q.includes(sub.name.toLowerCase())) {
        result.subcategory = sub.slug
        break
      }
    }
  } else {
    // If category wasn't matched, still try to match any subcategory to set both
    for (const cat of categories) {
      for (const sub of cat.subcategories || []) {
        if (q.includes(sub.slug) || q.includes(sub.name.toLowerCase())) {
          result.category = cat.slug
          result.subcategory = sub.slug
          break
        }
      }
      if (result.subcategory) break
    }
  }

  // Price parsing: under/over/between and ranges like 50-100, 50 to 100, ₹, $ supported
  const normalized = q.replace(/[,₹$]/g, "")
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

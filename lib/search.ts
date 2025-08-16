import type { Product } from "@/types/product"
import type { ProductFilters, FilterGroup, SearchResult } from "@/types/filters"
import { products } from "@/lib/products"

export function searchProducts(query = "", filters: ProductFilters = {}): SearchResult {
  let filteredProducts = [...products]

  // Text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        product.material.toLowerCase().includes(searchTerm) ||
        product.color.toLowerCase().includes(searchTerm),
    )
  }

  // Apply filters
  if (filters.category) {
    filteredProducts = filteredProducts.filter((product) => product.category === filters.category)
  }

  if (filters.subcategory) {
    filteredProducts = filteredProducts.filter((product) => product.subcategory === filters.subcategory)
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange
    filteredProducts = filteredProducts.filter((product) => product.price >= min && product.price <= max)
  }

  if (filters.materials && filters.materials.length > 0) {
    filteredProducts = filteredProducts.filter((product) => filters.materials!.includes(product.material))
  }

  if (filters.colors && filters.colors.length > 0) {
    filteredProducts = filteredProducts.filter((product) => filters.colors!.includes(product.color))
  }

  if (filters.sizes && filters.sizes.length > 0) {
    filteredProducts = filteredProducts.filter((product) => product.size && filters.sizes!.includes(product.size))
  }

  if (filters.inStock !== undefined) {
    filteredProducts = filteredProducts.filter((product) => product.inStock === filters.inStock)
  }

  if (filters.rating) {
    filteredProducts = filteredProducts.filter((product) => product.rating >= filters.rating!)
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredProducts = filteredProducts.filter((product) => filters.tags!.some((tag) => product.tags.includes(tag)))
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
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
    appliedFilters: filters,
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
        { value: "0-50", label: "Under $50", count: filteredProducts.filter((p) => p.price < 50).length },
        {
          value: "50-100",
          label: "$50 - $100",
          count: filteredProducts.filter((p) => p.price >= 50 && p.price < 100).length,
        },
        {
          value: "100-200",
          label: "$100 - $200",
          count: filteredProducts.filter((p) => p.price >= 100 && p.price < 200).length,
        },
        { value: "200+", label: "$200+", count: filteredProducts.filter((p) => p.price >= 200).length },
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

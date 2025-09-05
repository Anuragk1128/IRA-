import type { Product } from "@/types/product"
import type { ProductFilters, FilterGroup } from "@/types/filters"
import { findProductsByCategory } from "./mockData"

// Check if a value is a backend ID (kept for compatibility)
export function isBackendId(value?: string): boolean {
  return true; // Always return true since we're using mock data
}

// New backend integration: fetch products by brand/category/subcategory slugs
export async function fetchBrandProductsByCategorySubcategory(
  brandSlug: string,
  categorySlug: string,
  subcategorySlug: string
): Promise<Product[]> {
  const base = "https://hoe-be.onrender.com"
  const url = `${base}/api/brands/${encodeURIComponent(brandSlug)}/categories/${encodeURIComponent(categorySlug)}/subcategories/${encodeURIComponent(subcategorySlug)}/products`
  const res = await fetch(url, { headers: { accept: "*/*" }, cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
  const json = await res.json() as { data?: any[] } | any[]
  const list = Array.isArray(json) ? json : (json?.data ?? [])
  return list.map((it: any): Product => {
    const attrs = it.attributes || {}
    const sizes: string[] = Array.isArray(attrs.size) ? attrs.size : []
    const colors: string[] = Array.isArray(attrs.color) ? attrs.color : []
    return {
      id: String(it._id ?? it.id ?? it.slug ?? it.title),
      name: String(it.title ?? ""),
      description: String(it.description ?? ""),
      price: typeof it.price === 'number' ? it.price : Number(it.price ?? 0),
      originalPrice: typeof it.compareAtPrice === 'number' ? it.compareAtPrice : (it.compareAtPrice ? Number(it.compareAtPrice) : undefined),
      images: Array.isArray(it.images) ? it.images.map((u: any) => String(u)) : [],
      category: String(it.categoryId ?? ""),
      subcategory: String(it.subcategoryId ?? ""),
      material: String(attrs.material ?? ""),
      color: colors[0] ? String(colors[0]) : "",
      size: sizes[0] ? String(sizes[0]) : undefined,
      inStock: typeof it.stock === 'number' ? it.stock > 0 : true,
      rating: 0,
      reviewCount: 0,
      tags: Array.isArray(it.tags) ? it.tags.map((t: any) => String(t)) : [],
      createdAt: it.createdAt ? String(it.createdAt) : undefined,
      updatedAt: it.updatedAt ? String(it.updatedAt) : undefined,
    }
  })
}

// Helper for category view: if subcategory slug provided, fetch that; else fetch all subs and combine
export async function fetchBrandCategoryProducts(
  categorySlug: string,
  subcategorySlug?: string
): Promise<Product[]> {
  const brand = process.env.NEXT_PUBLIC_BRAND_SLUG || "ira"
  if (subcategorySlug) {
    return fetchBrandProductsByCategorySubcategory(brand, categorySlug, subcategorySlug)
  }
  // No sub slug: fetch all subcategories for the category, then aggregate
  const { fetchBrandSubcategories } = await import("./catalog")
  const subs = await fetchBrandSubcategories(brand, categorySlug)
  const chunks = await Promise.all(
    subs.map((s) => fetchBrandProductsByCategorySubcategory(brand, categorySlug, s.slug || s.name))
  )
  return chunks.flat()
}

export async function fetchProductsByCategory(params: {
  categoryId: string
  subcategoryId?: string
}): Promise<Product[]> {
  // Get all products for the category
  let products = findProductsByCategory(params.categoryId)
  
  // Filter by subcategory if provided
  if (params.subcategoryId) {
    products = products.filter(p => p.subcategory === params.subcategoryId)
  }
  
  return products
}

export async function fetchProductsFromApi(params?: {
  categoryId?: string
  subcategoryId?: string
}): Promise<Product[]> {
  const { findProductsByCategory, mockProducts } = await import('./mockData')
  
  if (params?.categoryId) {
    let products = findProductsByCategory(params.categoryId)
    if (params.subcategoryId) {
      products = products.filter(p => p.subcategory === params.subcategoryId)
    }
    return products
  }
  
  // Return all products if no filters
  return mockProducts
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const base = "https://hoe-be.onrender.com"
  const url = `${base}/api/products/${encodeURIComponent(id)}`
  const res = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" })
  if (!res.ok) return null
  const json = await res.json() as { data?: any }
  const it = json?.data
  if (!it) return null
  const attrs = it.attributes || {}
  const sizes: string[] = Array.isArray(attrs.size) ? attrs.size : []
  const colors: string[] = Array.isArray(attrs.color) ? attrs.color : []
  const mapped: Product = {
    id: String(it._id ?? it.id ?? it.slug ?? it.title),
    name: String(it.title ?? ""),
    description: String(it.description ?? ""),
    price: typeof it.price === 'number' ? it.price : Number(it.price ?? 0),
    originalPrice: typeof it.compareAtPrice === 'number' ? it.compareAtPrice : (it.compareAtPrice ? Number(it.compareAtPrice) : undefined),
    images: Array.isArray(it.images) ? it.images.map((u: any) => String(u)) : [],
    category: String(it.categoryId ?? ""),
    subcategory: String(it.subcategoryId ?? ""),
    material: String(attrs.material ?? ""),
    color: colors[0] ? String(colors[0]) : "",
    size: sizes[0] ? String(sizes[0]) : undefined,
    inStock: typeof it.stock === 'number' ? it.stock > 0 : true,
    rating: 0,
    reviewCount: 0,
    tags: Array.isArray(it.tags) ? it.tags.map((t: any) => String(t)) : [],
    createdAt: it.createdAt ? String(it.createdAt) : undefined,
    updatedAt: it.updatedAt ? String(it.updatedAt) : undefined,
  }
  return mapped
}

export function applyClientFiltersAndSort(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  let result = [...products]

  // Only apply category/subcategory filters when they look like backend IDs
  if (filters.category && isBackendId(filters.category)) {
    result = result.filter((p) => p.category === filters.category)
  }
  if (filters.subcategory && isBackendId(filters.subcategory)) {
    result = result.filter((p) => p.subcategory === filters.subcategory)
  }
  if (filters.priceRange) {
    const [min, max] = filters.priceRange
    result = result.filter((p) => p.price >= min && p.price <= max)
  }
  if (filters.materials?.length) {
    result = result.filter((p) => filters.materials!.includes(p.material))
  }
  if (filters.colors?.length) {
    result = result.filter((p) => filters.colors!.includes(p.color))
  }
  if (filters.sizes?.length) {
    result = result.filter((p) => (p.size ? filters.sizes!.includes(p.size) : false))
  }
  if (filters.inStock !== undefined) {
    result = result.filter((p) => p.inStock === filters.inStock)
  }
  if (filters.rating) {
    result = result.filter((p) => p.rating >= filters.rating!)
  }
  if (filters.tags?.length) {
    result = result.filter((p) => filters.tags!.some((t) => p.tags.includes(t)))
  }

  // Sorting
  switch (filters.sortBy) {
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "price-low":
      result.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      result.sort((a, b) => b.price - a.price)
      break
    case "rating":
      result.sort((a, b) => b.rating - a.rating)
      break
    case "newest":
      result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0))
      break
    case "bestseller":
      result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0))
      break
  }

  return result
}

export function generateFilterGroupsFor(
  allProducts: Product[],
  filteredProducts: Product[],
): FilterGroup[] {
  const materialCounts = new Map<string, number>()
  const colorCounts = new Map<string, number>()
  const sizeCounts = new Map<string, number>()

  filteredProducts.forEach((p) => {
    materialCounts.set(p.material, (materialCounts.get(p.material) || 0) + 1)
    colorCounts.set(p.color, (colorCounts.get(p.color) || 0) + 1)
    if (p.size) sizeCounts.set(p.size, (sizeCounts.get(p.size) || 0) + 1)
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
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    },
    {
      id: "colors",
      name: "Color",
      type: "checkbox",
      options: Array.from(colorCounts.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    },
    {
      id: "sizes",
      name: "Size",
      type: "checkbox",
      options: Array.from(sizeCounts.entries())
        .map(([value, count]) => ({ value, label: value, count }))
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

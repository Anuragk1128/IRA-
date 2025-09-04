import type { Product } from "@/types/product"
import type { ProductFilters, FilterGroup } from "@/types/filters"

const BASE_URL = "https://ira-be.onrender.com"

// Raw API response shape
interface ApiProductsResponse {
  products: Array<{
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    images: string[]
    categoryId: string
    subcategoryId?: string
    material: string
    color: string
    size?: string
    inStock: boolean
    rating: number
    reviewCount: number
    tags: string[]
    featured?: boolean
    bestseller?: boolean
    newArrival?: boolean
    createdAt?: string
    updatedAt?: string
  }>
}

interface ApiProductResponse {
  product: {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    images: string[]
    categoryId: string
    subcategoryId?: string
    material: string
    color: string
    size?: string
    inStock: boolean
    rating: number
    reviewCount: number
    tags: string[]
    featured?: boolean
    bestseller?: boolean
    newArrival?: boolean
    createdAt?: string
    updatedAt?: string
  }
}

export async function fetchProductsByCategory(params: {
  categoryId: string
  subcategoryId?: string
}): Promise<Product[]> {
  const url = new URL("/api/products/by-category", BASE_URL)
  url.searchParams.set("categoryId", params.categoryId)
  if (params.subcategoryId) url.searchParams.set("subcategoryId", params.subcategoryId)

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { accept: "application/json" },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch products by category: ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as ApiProductsResponse
  const mapped: Product[] = (data.products || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    images: Array.isArray(p.images) 
      ? p.images
          .filter(img => img && typeof img === 'string') // Filter out invalid image entries
          .map(img => {
            // Remove any surrounding quotes or whitespace
            const cleanImg = img.trim().replace(/^['"]|['"]$/g, '');
            // Handle different URL formats
            if (cleanImg.startsWith('http')) return cleanImg;
            if (cleanImg.startsWith('//')) return `https:${cleanImg}`;
            if (cleanImg.startsWith('/')) return `${BASE_URL}${cleanImg}`;
            return `${BASE_URL}/${cleanImg}`;
          })
          .filter(Boolean) // Remove any empty strings
      : [],
    category: p.categoryId,
    subcategory: p.subcategoryId,
    material: p.material,
    color: p.color,
    size: p.size,
    inStock: p.inStock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    tags: p.tags || [],
    featured: p.featured,
    bestseller: p.bestseller,
    newArrival: p.newArrival,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }))
  return mapped
}

export function isBackendId(value?: string): boolean {
  // crude check for 24-hex string Mongo-style id
  return !!value && /^[0-9a-fA-F]{24}$/.test(value)
}

export async function fetchProductsFromApi(params?: {
  categoryId?: string
  subcategoryId?: string
}): Promise<Product[]> {
  const url = new URL("/api/products", BASE_URL)
  // If the API supports filtering via query params, append them.
  if (params?.categoryId) url.searchParams.set("categoryId", params.categoryId)
  if (params?.subcategoryId) url.searchParams.set("subcategoryId", params.subcategoryId)

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { accept: "application/json" },
    // Avoid Next.js caching if used server-side accidentally
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as ApiProductsResponse

  // Map API product to local Product type
  const mapped: Product[] = (data.products || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    images: Array.isArray(p.images) 
      ? p.images
          .filter(img => img && typeof img === 'string') // Filter out invalid image entries
          .map(img => {
            // Remove any surrounding quotes or whitespace
            const cleanImg = img.trim().replace(/^['"]|['"]$/g, '');
            // Handle different URL formats
            if (cleanImg.startsWith('http')) return cleanImg;
            if (cleanImg.startsWith('//')) return `https:${cleanImg}`;
            if (cleanImg.startsWith('/')) return `${BASE_URL}${cleanImg}`;
            return `${BASE_URL}/${cleanImg}`;
          })
          .filter(Boolean) // Remove any empty strings
      : [],
    // Map ids into our Product fields. We will treat these as ids in the app logic.
    category: p.categoryId,
    subcategory: p.subcategoryId,
    material: p.material,
    color: p.color,
    size: p.size,
    inStock: p.inStock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    tags: p.tags || [],
    featured: p.featured,
    bestseller: p.bestseller,
    newArrival: p.newArrival,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }))

  return mapped
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const url = new URL(`/api/products/${id}`, BASE_URL)
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { accept: "application/json" },
    cache: "no-store",
  })
  if (!res.ok) {
    // 404 => return null to let caller notFound()
    if (res.status === 404) return null
    throw new Error(`Failed to fetch product ${id}: ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as ApiProductResponse
  const p = data.product
  if (!p) return null
  console.log('Raw single product data from API:', p.images);
  const mapped: Product = {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    images: Array.isArray(p.images) 
      ? p.images
          .filter(img => img && typeof img === 'string') // Filter out invalid image entries
          .map(img => {
            // Remove any surrounding quotes or whitespace
            const cleanImg = img.trim().replace(/^['"]|['"]$/g, '');
            // Handle different URL formats
            if (cleanImg.startsWith('http')) return cleanImg;
            if (cleanImg.startsWith('//')) return `https:${cleanImg}`;
            if (cleanImg.startsWith('/')) return `${BASE_URL}${cleanImg}`;
            return `${BASE_URL}/${cleanImg}`;
          })
          .filter(Boolean) // Remove any empty strings
      : [],
    category: p.categoryId,
    subcategory: p.subcategoryId,
    material: p.material,
    color: p.color,
    size: p.size,
    inStock: p.inStock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    tags: p.tags || [],
    featured: p.featured,
    bestseller: p.bestseller,
    newArrival: p.newArrival,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
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
      options: [
        { value: "0-50", label: "Under $50", count: filteredProducts.filter((p) => p.price < 50).length },
        { value: "50-100", label: "$50 - $100", count: filteredProducts.filter((p) => p.price >= 50 && p.price < 100).length },
        { value: "100-200", label: "$100 - $200", count: filteredProducts.filter((p) => p.price >= 100 && p.price < 200).length },
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

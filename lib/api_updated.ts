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
      ? p.images.map(img => 
          img.startsWith('http') ? img : 
          img.startsWith('/') ? `${BASE_URL}${img}` : 
          `${BASE_URL}/${img}`
        )
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
  return value ? /^[0-9a-fA-F]{24}$/.test(value) : false
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
  const mapped: Product = {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    images: Array.isArray(p.images) 
      ? p.images.map(img => 
          img.startsWith('http') ? img : 
          img.startsWith('/') ? `${BASE_URL}${img}` : 
          `${BASE_URL}/${img}`
        )
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

// Rest of the file remains unchanged...

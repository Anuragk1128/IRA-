import type { CreateProductInput, Product } from "@/types/product"
import { mockProducts } from "@/lib/mockData"

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const newProduct: Product = {
    id: `p-${Math.random().toString(36).slice(2)}`,
    name: input.name,
    description: input.description,
    price: input.price,
    originalPrice: input.originalPrice,
    images: input.images || [],
    category: input.categoryId,
    subcategory: input.subcategoryId,
    material: input.material,
    color: input.color,
    size: input.size,
    inStock: input.inStock,
    rating: input.rating ?? 0,
    reviewCount: input.reviewCount ?? 0,
    tags: input.tags ?? [],
    featured: input.featured,
    bestseller: input.bestseller,
    newArrival: input.newArrival,
  }
  mockProducts.push(newProduct)
  return newProduct
}

export interface CreateAdminProductInput {
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
  rating?: number
  reviewCount?: number
  tags?: string[]
  featured?: boolean
  bestseller?: boolean
  newArrival?: boolean
}

export async function createAdminProduct(input: CreateAdminProductInput): Promise<Product> {
  return createProduct({
    name: input.name,
    description: input.description,
    price: input.price,
    originalPrice: input.originalPrice,
    images: input.images,
    categoryId: input.categoryId,
    subcategoryId: input.subcategoryId,
    material: input.material,
    color: input.color,
    size: input.size,
    inStock: input.inStock,
    rating: input.rating,
    reviewCount: input.reviewCount,
    tags: input.tags,
    featured: input.featured,
    bestseller: input.bestseller,
    newArrival: input.newArrival,
  })
}

export async function deleteProduct(id: string): Promise<void> {
  const idx = mockProducts.findIndex(p => p.id === id)
  if (idx >= 0) mockProducts.splice(idx, 1)
}

export async function listAdminProducts(): Promise<Product[]> {
  return [...mockProducts]
}

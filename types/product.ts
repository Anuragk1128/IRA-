export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
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

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  subcategories?: ProductSubcategory[]
}

export interface ProductSubcategory {
  id: string
  name: string
  slug: string
  description: string
}

// Payload for creating a product via API
export interface CreateProductInput {
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
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

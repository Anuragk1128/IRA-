import { getAdminAuthToken } from "@/lib/admin-auth"
import type { CreateProductInput, Product } from "@/types/product"

// Ensure API base comes from env and ends without trailing slash.
// Expect env to include /api (e.g., https://ira-be.onrender.com/api)
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "https://ira-be.onrender.com/api"
).replace(/\/$/, "")

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const token = getAdminAuthToken()
  if (!token) throw new Error("Not authenticated. Please login as admin.")

  const res = await fetch(`${API_BASE}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    let message = `Failed to create product (${res.status})`
    try {
      const err = await res.json()
      message = err?.message || err?.error || JSON.stringify(err) || message
    } catch {}
    throw new Error(message)
  }

  const data = await res.json()
  const product: Product = data?.product || data
  if (!product || !product.id) {
    throw new Error("Invalid response from server: missing product or id")
  }
  return product
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
  const token = getAdminAuthToken()
  if (!token) throw new Error("Not authenticated. Please login as admin.")

  const res = await fetch(`${API_BASE}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    let message = `Failed to create product (${res.status})`
    try {
      const err = await res.json()
      message = err?.message || err?.error || JSON.stringify(err) || message
    } catch {}
    throw new Error(message)
  }

  const data = await res.json()
  const product: Product = (data?.product || data)
  if (!product || !product.id) {
    // Some backends may return the created entity under different key; fall back to any id
    const anyId = (data?.product?.id || data?.id)
    if (!anyId) throw new Error("Invalid response from server: missing product or id")
  }
  return product
}

export async function deleteProduct(id: string): Promise<void> {
  const token = getAdminAuthToken()
  if (!token) throw new Error("Not authenticated. Please login as admin.")

  const res = await fetch(`${API_BASE}/admin/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    let message = `Failed to delete product (${res.status})`
    try {
      const err = await res.json()
      message = err?.message || err?.error || JSON.stringify(err) || message
    } catch {}
    throw new Error(message)
  }
}

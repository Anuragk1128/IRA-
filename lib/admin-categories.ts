import { getAdminAuthToken } from "@/lib/admin-auth"
import type { ProductCategory, ProductSubcategory } from "@/types/product"

// Ensure API base comes from env and ends without trailing slash.
// Expect env to include /api (e.g., https://ira-be.onrender.com/api)
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "https://ira-be.onrender.com/api"
).replace(/\/$/, "")

function normalizeSubcategory(raw: any): ProductSubcategory {
  return {
    id: String(raw?.id ?? raw?._id ?? cryptoRandomId()),
    name: String(raw?.name ?? raw?.title ?? "Unnamed"),
    slug: String(raw?.slug ?? raw?.name ?? ""),
    description: String(raw?.description ?? raw?.desc ?? ""),
  }
}

export interface CreateSubcategoryInput {
  name: string
  slug: string
  description?: string
}

export async function createAdminSubcategory(
  categoryId: string,
  input: CreateSubcategoryInput
): Promise<ProductSubcategory> {
  const token = getAdminAuthToken()
  if (!token) throw new Error("Not authenticated. Please login as admin.")

  const res = await fetch(`${API_BASE}/admin/categories/${encodeURIComponent(categoryId)}/subcategories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    let message = `Failed to create subcategory (${res.status})`
    try {
      const err = await res.json()
      message = err?.message || err?.error || JSON.stringify(err) || message
    } catch {}
    throw new Error(message)
  }

  const data = await res.json()
  const raw = data?.subcategory ?? data?.data?.subcategory ?? data?.data ?? data
  return normalizeSubcategory(raw)
}

export interface CreateCategoryInput {
  name: string
  slug: string
  description?: string
  image?: string
}

export async function createAdminCategory(input: CreateCategoryInput): Promise<ProductCategory> {
  const token = getAdminAuthToken()
  if (!token) throw new Error("Not authenticated. Please login as admin.")

  const res = await fetch(`${API_BASE}/admin/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    let message = `Failed to create category (${res.status})`
    try {
      const err = await res.json()
      message = err?.message || err?.error || JSON.stringify(err) || message
    } catch {}
    throw new Error(message)
  }

  const data = await res.json()
  const raw = data?.category ?? data?.data?.category ?? data?.data ?? data
  return normalizeCategory(raw)
}

function normalizeCategory(raw: any): ProductCategory {
  const rawSubs = raw?.subcategories ?? raw?.subCategories ?? raw?.children ?? []
  const subcategories: ProductSubcategory[] = Array.isArray(rawSubs)
    ? rawSubs.map(normalizeSubcategory)
    : []

  return {
    id: String(raw?.id ?? raw?._id ?? cryptoRandomId()),
    name: String(raw?.name ?? raw?.title ?? "Unnamed"),
    slug: String(raw?.slug ?? raw?.name ?? ""),
    description: String(raw?.description ?? raw?.desc ?? ""),
    image: String(raw?.image ?? raw?.thumbnail ?? raw?.icon ?? "/placeholder.svg"),
    subcategories,
  }
}

// Fallback random id in case backend misses ids
function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

export async function fetchAdminCategories(): Promise<ProductCategory[]> {
  const token = getAdminAuthToken()
  if (!token) throw new Error("Not authenticated. Please login as admin.")

  const res = await fetch(`${API_BASE}/admin/categories`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    // Next.js fetch cache hint, treat as always fresh in admin
    cache: "no-store",
  })

  if (!res.ok) {
    let message = `Failed to fetch categories (${res.status})`
    try {
      const err = await res.json()
      message = err?.message || err?.error || JSON.stringify(err) || message
    } catch {}
    throw new Error(message)
  }

  const data = await res.json()
  const list = (data?.categories ?? data?.data?.categories ?? data?.data ?? data) as any
  if (!Array.isArray(list)) {
    throw new Error("Invalid categories response format")
  }
  return list.map(normalizeCategory)
}

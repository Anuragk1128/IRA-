import type { ProductCategory, ProductSubcategory } from "@/types/product"
import { mockCategories } from "@/lib/mockData"

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
  const cat = mockCategories.find(c => c.id === categoryId)
  if (!cat) throw new Error("Category not found")
  const sub: ProductSubcategory = {
    id: cryptoRandomId(),
    name: input.name,
    slug: input.slug,
    description: input.description ?? "",
  }
  cat.subcategories = cat.subcategories || []
  cat.subcategories.push({ id: sub.id, name: sub.name, slug: sub.slug, description: sub.description })
  return sub
}

export interface CreateCategoryInput {
  name: string
  slug: string
  description?: string
  image?: string
}

export async function createAdminCategory(input: CreateCategoryInput): Promise<ProductCategory> {
  const cat: ProductCategory = {
    id: cryptoRandomId(),
    name: input.name,
    slug: input.slug,
    description: input.description ?? "",
    image: input.image ?? "/placeholder.svg",
    subcategories: [],
  }
  mockCategories.push({ id: cat.id, name: cat.name, slug: cat.slug, description: cat.description, image: cat.image, subcategories: [] })
  return cat
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

export interface UpdateCategoryInput {
  name: string
  slug: string
  description?: string
  image?: string
}

export async function updateAdminCategory(
  categoryId: string,
  input: UpdateCategoryInput
): Promise<ProductCategory> {
  const idx = mockCategories.findIndex(c => c.id === categoryId)
  if (idx === -1) throw new Error("Category not found")
  const current = mockCategories[idx]
  const updated = {
    ...current,
    name: input.name,
    slug: input.slug,
    description: input.description ?? current.description,
    image: input.image ?? current.image,
  }
  mockCategories[idx] = updated
  return normalizeCategory(updated)
}

export async function fetchAdminCategories(): Promise<ProductCategory[]> {
  return mockCategories.map(normalizeCategory)
}

export function getCategoryById(id: string): ProductCategory | null {
  const found = mockCategories.find(c => c.id === id)
  return found ? normalizeCategory(found) : null
}

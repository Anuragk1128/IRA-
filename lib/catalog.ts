const BASE_URL = "https://ira-be.onrender.com"

export interface BackendSubcategory {
  id: string
  name: string
  slug?: string
  description?: string
}

export interface BackendCategory {
  id: string
  name: string
  slug?: string
  description?: string
  image?: string
  subcategories?: BackendSubcategory[]
}

export async function fetchCategoriesFromApi(): Promise<BackendCategory[]> {
  const url = new URL("/api/categories", BASE_URL)
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { accept: "application/json" },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as { categories?: BackendCategory[] } | BackendCategory[]
  // Support both { categories: [...] } and [...] shapes
  const cats = Array.isArray(data) ? data : data.categories || []
  return cats
}

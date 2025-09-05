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

// New backend: fetch brand categories by slug
// GET https://hoe-be.onrender.com/api/brands/{brandSlug}/categories
export async function fetchBrandCategories(brandSlug: string): Promise<BackendCategory[]> {
  const base = "https://hoe-be.onrender.com"
  const url = `${base}/api/brands/${encodeURIComponent(brandSlug)}/categories`
  const res = await fetch(url, { headers: { accept: "*/*" }, cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to fetch brand categories: ${res.status}`)
  const json = await res.json() as { data?: any[] } | any[]
  const list = Array.isArray(json) ? json : (json?.data ?? [])
  return list.map((c: any) => ({
    id: String(c._id ?? c.id ?? c.slug ?? c.name),
    name: String(c.name ?? ""),
    slug: c.slug ? String(c.slug) : undefined,
    image: c.image ? String(c.image) : undefined,
    description: c.description ? String(c.description) : undefined,
    subcategories: [],
  }))
}

// Back-compat: previously used in many places. Delegate to brand categories with a default brand.
export async function fetchCategoriesFromApi(): Promise<BackendCategory[]> {
  const brand = process.env.NEXT_PUBLIC_BRAND_SLUG || "ira"
  return fetchBrandCategories(brand)
}

// New backend: fetch subcategories for a brand category by its slug
// GET https://hoe-be.onrender.com/api/brands/{brandSlug}/categories/{categorySlug}/subcategories
export async function fetchBrandSubcategories(
  brandSlug: string,
  categorySlug: string
): Promise<BackendSubcategory[]> {
  const base = "https://hoe-be.onrender.com"
  const url = `${base}/api/brands/${encodeURIComponent(brandSlug)}/categories/${encodeURIComponent(categorySlug)}/subcategories`
  const res = await fetch(url, { headers: { accept: "*/*" }, cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to fetch subcategories: ${res.status}`)
  const json = await res.json() as { data?: any[] } | any[]
  const list = Array.isArray(json) ? json : (json?.data ?? [])
  return list.map((s: any) => ({
    id: String(s._id ?? s.id ?? s.slug ?? s.name),
    name: String(s.name ?? ""),
    slug: s.slug ? String(s.slug) : undefined,
    description: s.description ? String(s.description) : undefined,
  }))
}

// Fetch all products to extract unique materials, price ranges, and occasions
export async function fetchAllProductsForAttributes(): Promise<{
  materials: string[]
  priceRanges: { label: string; min: number; max: number | undefined }[]
  occasions: string[]
}> {
  const base = "https://hoe-be.onrender.com"
  const brand = process.env.NEXT_PUBLIC_BRAND_SLUG || "ira"
  
  try {
    // Fetch all products from all categories
    const categories = await fetchBrandCategories(brand)
    const allProducts = []
    
    for (const category of categories) {
      try {
        const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-')
        const subcategories = await fetchBrandSubcategories(brand, categorySlug)
        
        for (const subcategory of subcategories) {
          try {
            const subcategorySlug = subcategory.slug || subcategory.name.toLowerCase().replace(/\s+/g, '-')
            const { fetchBrandProductsByCategorySubcategory } = await import("./api")
            const products = await fetchBrandProductsByCategorySubcategory(brand, categorySlug, subcategorySlug)
            allProducts.push(...products)
          } catch (e) {
            // Skip if subcategory fetch fails
            console.warn(`Failed to fetch products for subcategory ${subcategory.name}:`, e)
          }
        }
      } catch (e) {
        // Skip if category fetch fails
        console.warn(`Failed to fetch subcategories for category ${category.name}:`, e)
      }
    }
    
    // Extract unique materials
    const materials = [...new Set(allProducts.map(p => p.material).filter(Boolean))]
    
    // Generate price ranges based on actual product prices
    const prices = allProducts.map(p => p.price).sort((a, b) => a - b)
    const minPrice = Math.floor(prices[0] / 500) * 500
    const maxPrice = Math.ceil(prices[prices.length - 1] / 500) * 500
    
    const priceRanges = []
    for (let i = minPrice; i < maxPrice; i += 500) {
      const rangeStart = i
      const rangeEnd = i + 500
      const count = allProducts.filter(p => p.price >= rangeStart && p.price < rangeEnd).length
      if (count > 0) {
        priceRanges.push({
          label: `₹${rangeStart.toLocaleString()} - ₹${rangeEnd.toLocaleString()}`,
          min: rangeStart,
          max: rangeEnd
        })
      }
    }
    
    // Add the final range for the highest prices
    const finalRangeStart = maxPrice
    const finalCount = allProducts.filter(p => p.price >= finalRangeStart).length
    if (finalCount > 0) {
      priceRanges.push({
        label: `₹${finalRangeStart.toLocaleString()}+`,
        min: finalRangeStart,
        max: undefined
      })
    }
    
    // Extract unique occasions from tags
    const occasions = [...new Set(allProducts.flatMap(p => p.tags).filter(Boolean))]
    
    return {
      materials: materials.sort(),
      priceRanges,
      occasions: occasions.sort()
    }
  } catch (error) {
    console.warn('Failed to fetch product attributes, using fallback values:', error)
    // Return fallback values if API fails
    return {
      materials: ['Silver coated', 'Gold coated', 'Stainless Steel', 'Copper'],
      priceRanges: [
        { label: '₹1,000 - ₹1,500', min: 1000, max: 1500 },
        { label: '₹1,500 - ₹2,000', min: 1500, max: 2000 },
        { label: '₹2,000 - ₹2,500', min: 2000, max: 2500 },
        { label: '₹2,500 - ₹3,000', min: 2500, max: 3000 },
        { label: '₹3,000+', min: 3000, max: undefined }
      ],
      occasions: ['Daily Wear', 'Casual Outings', 'Festive', 'Anniversary', 'Wedding']
    }
  }
}

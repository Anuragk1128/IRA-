// Cart API integration
// Reads auth token from localStorage (key: "auth-token")
// Base URL follows lib/auth.ts convention

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "https://ira-be.onrender.com/api"
).replace(/\/$/, "")

export type AddToCartPayload = {
  productId: string
  quantity: number
}

export type ApiCartItem = {
  id?: string
  productId: string
  name?: string
  price?: number
  originalPrice?: number
  image?: string
  material?: string
  color?: string
  size?: string
  quantity: number
  inStock?: boolean
}

export type ApiCartResponse = {
  items: ApiCartItem[]
  subtotal?: number
  tax?: number
  shipping?: number
  total?: number
  itemCount?: number
}

function getToken(): string | null {
  if (typeof window === "undefined") return null
  const t = localStorage.getItem("auth-token")
  if (!t) {
    console.warn("[cart] No auth-token in localStorage; API calls will fail")
  }
  return t
}

export async function addToCartAPI(payload: AddToCartPayload): Promise<void> {
  const token = getToken()
  if (!token) throw new Error("Not authenticated. Please sign in.")
  console.debug("[cart] addToCartAPI ->", payload)
  const res = await fetch(`${API_BASE}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  console.debug("[cart] addToCartAPI status:", res.status)

  if (!res.ok) {
    let msg = "Failed to add to cart"
    try {
      const data = await res.json()
      msg = data.message || data.error || msg
    } catch {}
    throw new Error(msg)
  }
}

export async function getCartAPI(): Promise<ApiCartResponse> {
  const token = getToken()
  if (!token) throw new Error("Not authenticated. Please sign in.")
  console.debug("[cart] getCartAPI -> fetching")
  const res = await fetch(`${API_BASE}/cart`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })
  console.debug("[cart] getCartAPI status:", res.status)

  if (!res.ok) {
    let msg = "Failed to load cart"
    try {
      const data = await res.json()
      msg = data.message || data.error || msg
    } catch {}
    throw new Error(msg)
  }

  const data = (await res.json()) as any

  // Normalize to ApiCartResponse shape leniently
  const itemsRaw: any[] = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : []
  const items: ApiCartItem[] = itemsRaw.map((it) => ({
    id: String(it.id ?? `${it.productId ?? ""}`),
    productId: String(it.productId ?? ""),
    name: it.name ? String(it.name) : undefined,
    price: typeof it.price === "number" ? it.price : Number(it.price ?? 0),
    originalPrice: typeof it.originalPrice === "number" ? it.originalPrice : it.originalPrice ? Number(it.originalPrice) : undefined,
    image: it.image ? String(it.image) : undefined,
    material: it.material ? String(it.material) : undefined,
    color: it.color ? String(it.color) : undefined,
    size: it.size ? String(it.size) : undefined,
    quantity: typeof it.quantity === "number" ? it.quantity : Number(it.quantity ?? 1),
    inStock: it.inStock !== undefined ? Boolean(it.inStock) : true,
  }))

  return {
    items,
    subtotal: typeof data?.subtotal === "number" ? data.subtotal : undefined,
    tax: typeof data?.tax === "number" ? data.tax : undefined,
    shipping: typeof data?.shipping === "number" ? data.shipping : undefined,
    total: typeof data?.total === "number" ? data.total : undefined,
    itemCount: typeof data?.itemCount === "number" ? data.itemCount : undefined,
  }
}

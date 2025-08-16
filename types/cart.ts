export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  image: string
  material: string
  color: string
  size?: string
  quantity: number
  inStock: boolean
}

export interface Cart {
  items: CartItem[]
  total: number
  subtotal: number
  tax: number
  shipping: number
  itemCount: number
}

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  image: string
  material: string
  color: string
  size?: string
  inStock: boolean
  addedAt: string
}

export interface Wishlist {
  items: WishlistItem[]
  itemCount: number
}

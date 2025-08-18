export interface AdminStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalUsers: number
  pendingOrders: number
  lowStockProducts: number
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "manager" | "staff"
  permissions: string[]
  avatar?: string
  createdAt: string
  lastLogin: string
}

export interface AdminAuthState {
  adminUser: AdminUser | null
  isAdminAuthenticated: boolean
  isLoading: boolean
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  subcategory: string
  material: string
  color: string
  sizes: string[]
  images: string[]
  inStock: boolean
  stockQuantity: number
  featured: boolean
  tags: string[]
}


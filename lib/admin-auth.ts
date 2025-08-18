import type { AdminUser } from "@/types/admin"

// Mock admin user data
const mockAdminUser: AdminUser = {
  id: "admin-1",
  email: "admin@luxejewelry.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  permissions: ["products", "orders", "users", "analytics", "settings"],
  avatar: "/placeholder.svg?height=100&width=100",
  createdAt: "2023-01-01T00:00:00Z",
  lastLogin: new Date().toISOString(),
}

export async function adminSignIn(email: string, password: string): Promise<{ adminUser: AdminUser; token: string }> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Demo admin credentials
  if (email === "admin@luxejewelry.com" && password === "admin123") {
    return {
      adminUser: { ...mockAdminUser, lastLogin: new Date().toISOString() },
      token: "admin-jwt-token",
    }
  }

  throw new Error("Invalid admin credentials")
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const token = localStorage.getItem("admin-auth-token")
  if (!token) return null

  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockAdminUser
}

export function setAdminAuthToken(token: string): void {
  localStorage.setItem("admin-auth-token", token)
}

export function removeAdminAuthToken(): void {
  localStorage.removeItem("admin-auth-token")
}

export async function adminSignOut(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  removeAdminAuthToken()
}

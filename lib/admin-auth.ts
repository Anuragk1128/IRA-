import type { AdminUser } from "@/types/admin"

const ADMIN_TOKEN_KEY = "admin-auth-token"
const ADMIN_USER_KEY = "admin-user"

export async function adminSignIn(
  email: string,
  password: string
): Promise<{ adminUser: AdminUser; token: string }> {
  // Local stub: accept any credentials and create a fake token
  const token = `local-${Math.random().toString(36).slice(2)}`
  const adminUser: AdminUser = {
    id: "admin",
    email,
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    permissions: ["products", "orders", "users", "analytics", "settings"],
    avatar: undefined,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }
  setAdminAuthToken(token)
  setAdminUser(adminUser)
  return { adminUser, token }
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY)
  if (!token) return null
  const stored = localStorage.getItem(ADMIN_USER_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as AdminUser
  } catch {
    return null
  }
}

export function setAdminAuthToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

function setAdminUser(user: AdminUser): void {
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
}

export function getAdminAuthToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function removeAdminAuthToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
}

export async function adminSignOut(): Promise<void> {
  removeAdminAuthToken()
}

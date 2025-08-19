import type { AdminUser } from "@/types/admin"

const ADMIN_TOKEN_KEY = "admin-auth-token"
const ADMIN_USER_KEY = "admin-user"
// Ensure API base comes from env and ends without trailing slash.
// Expect env to include /api (e.g., https://ira-be.onrender.com/api)
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "https://ira-be.onrender.com/api"
).replace(/\/$/, "")

export async function adminSignIn(
  email: string,
  password: string
): Promise<{ adminUser: AdminUser; token: string }> {
  const res = await fetch(`${API_BASE}/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    let message = "Login failed"
    try {
      const err = await res.json()
      message = err?.message || err?.error || message
    } catch {}
    throw new Error(message)
  }

  const data = await res.json()
  const token: string = data?.token || data?.accessToken || data?.data?.token
  if (!token) throw new Error("No token returned from server")

  // Build AdminUser from API response if available; otherwise minimal fallback
  const userFromApi = data?.user || data?.data?.user || {}
  const adminUser: AdminUser = {
    id: String(userFromApi.id || userFromApi._id || "admin"),
    email: String(userFromApi.email || email),
    firstName: String(userFromApi.firstName || userFromApi.firstname || userFromApi.name || "Admin"),
    lastName: String(userFromApi.lastName || userFromApi.lastname || "User"),
    role: (userFromApi.role as AdminUser["role"]) || "admin",
    permissions: Array.isArray(userFromApi.permissions) ? userFromApi.permissions : ["products", "orders", "users", "analytics", "settings"],
    avatar: userFromApi.avatar || userFromApi.image || undefined,
    createdAt: String(userFromApi.createdAt || new Date().toISOString()),
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

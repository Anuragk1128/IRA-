import type { User, Address, UserPreferences } from "@/types/user"

// Helper to map API user to our User type safely
function mapApiUserToUser(apiUser: any): User {
  const addresses: Address[] = Array.isArray(apiUser?.addresses)
    ? apiUser.addresses.map((a: any) => ({
        id: String(a.id ?? ""),
        type: (a.type === "billing" ? "billing" : "shipping") as Address["type"],
        firstName: String(a.firstName ?? ""),
        lastName: String(a.lastName ?? ""),
        company: a.company ? String(a.company) : undefined,
        address1: String(a.address1 ?? ""),
        address2: a.address2 ? String(a.address2) : undefined,
        city: String(a.city ?? ""),
        state: String(a.state ?? ""),
        zipCode: String(a.zipCode ?? ""),
        country: String(a.country ?? ""),
        isDefault: Boolean(a.isDefault),
      }))
    : []

  const preferences: UserPreferences = {
    emailNotifications: Boolean(apiUser?.preferences?.emailNotifications ?? true),
    smsNotifications: Boolean(apiUser?.preferences?.smsNotifications ?? false),
    marketingEmails: Boolean(apiUser?.preferences?.marketingEmails ?? true),
    currency: String(apiUser?.preferences?.currency ?? "USD"),
    language: String(apiUser?.preferences?.language ?? "en"),
  }

  return {
    id: String(apiUser?.id ?? ""),
    email: String(apiUser?.email ?? ""),
    firstName: String(apiUser?.firstName ?? ""),
    lastName: String(apiUser?.lastName ?? ""),
    phone: apiUser?.phone ? String(apiUser.phone) : undefined,
    dateOfBirth: apiUser?.dateOfBirth ? String(apiUser.dateOfBirth) : undefined,
    avatar: apiUser?.avatar ? String(apiUser.avatar) : undefined,
    addresses,
    preferences,
    createdAt: String(apiUser?.createdAt ?? new Date().toISOString()),
    updatedAt: String(apiUser?.updatedAt ?? new Date().toISOString()),
  }
}

export async function signIn(email: string, password: string): Promise<{ user: User; token: string }> {
  // Real backend login integration
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hoe-be.onrender.com/api'
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    let message = 'Failed to sign in'
    try {
      const err = await res.json()
      message = err?.message || message
    } catch {}
    throw new Error(message)
  }

  const data = await res.json() as {
    token: string
    user: { id: string; name?: string; email: string; role?: string }
  }

  const fullName = String(data.user?.name ?? '')
  const [firstName, ...rest] = fullName.split(' ').filter(Boolean)
  const lastName = rest.join(' ')

  // Strict validation: require token and user id
  if (!data?.token || !data?.user?.id) {
    throw new Error('Invalid login response')
  }

  const user: User = {
    id: String(data.user?.id ?? ''),
    email: String(data.user?.email ?? email),
    firstName: firstName || '',
    lastName: lastName || '',
    // Do NOT expose role on the frontend; ignore it per requirements
    addresses: [],
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      currency: 'INR',
      language: 'en',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Attach token so contexts relying on user.token (e.g., wishlist) can access it easily
    token: String(data.token),
  }

  return { user, token: data.token }
}

// Send OTP to email for registration
export async function sendRegistrationOTP(email: string): Promise<{ message: string }> {
  const API_URL = 'https://hoe-be.onrender.com/api'
  
  const res = await fetch(`${API_URL}/auth/register/send-otp`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    let message = 'Failed to send OTP'
    try {
      const err = await res.json()
      message = err?.message || err?.error || message
    } catch {}
    throw new Error(message)
  }

  const data = await res.json()
  return data
}

// Register user with OTP
export async function signUpWithOTP(data: {
  email: string
  password: string
  name: string
  otp: string
}): Promise<{ user: User; token: string }> {
  const API_URL = 'https://hoe-be.onrender.com/api'

  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      name: data.name, 
      email: data.email, 
      password: data.password,
      otp: data.otp 
    }),
  })

  if (!res.ok) {
    let message = 'Failed to register'
    try {
      const err = await res.json()
      message = err?.message || err?.error || message
    } catch {}
    throw new Error(message)
  }

  const payload = await res.json() as {
    token: string
    user: { id: string; name: string; email: string; role?: string }
  }

  if (!payload?.token || !payload?.user?.id) {
    throw new Error('Invalid registration response')
  }

  // Split name into first/last
  const fullName = String(payload.user.name ?? '')
  const [firstName, ...rest] = fullName.split(' ').filter(Boolean)
  const lastName = rest.join(' ')

  const user: User = {
    id: String(payload.user.id),
    email: String(payload.user.email),
    firstName: firstName || '',
    lastName: lastName || '',
    addresses: [],
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      currency: 'INR',
      language: 'en',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    token: String(payload.token),
  }

  return { user, token: payload.token }
}

export async function signUp(data: {
  email: string
  password: string
  firstName: string
  lastName: string
}): Promise<{ user: User; token: string }> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hoe-be.onrender.com/api'

  const name = `${data.firstName} ${data.lastName}`.trim()
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email: data.email, password: data.password }),
  })

  if (!res.ok) {
    let message = 'Failed to register'
    try {
      const err = await res.json()
      message = err?.message || message
    } catch {}
    throw new Error(message)
  }

  const payload = await res.json() as {
    token: string
    user: { id: string; name: string; email: string; role?: string }
  }

  if (!payload?.token || !payload?.user?.id) {
    throw new Error('Invalid registration response')
  }

  // Split name into first/last
  const fullName = String(payload.user.name ?? '')
  const [firstName, ...rest] = fullName.split(' ').filter(Boolean)
  const lastName = rest.join(' ')

  const user: User = {
    id: String(payload.user.id),
    email: String(payload.user.email),
    firstName: firstName || '',
    lastName: lastName || '',
    addresses: [],
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      currency: 'INR',
      language: 'en',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    token: String(payload.token),
  }

  return { user, token: payload.token }
}

export async function signOut(): Promise<void> {
  // Optionally call your backend to invalidate refresh tokens if applicable
  await new Promise((resolve) => setTimeout(resolve, 200))
}

export async function getCurrentUser(): Promise<User | null> {
  // If you expose a profile endpoint, fetch it here using the stored token.
  const token = typeof window !== 'undefined' ? localStorage.getItem("auth-token") : null
  if (!token) return null
  // No profile endpoint configured yet, so return null to require fresh login
  return null
}

export function setAuthToken(token: string): void {
  localStorage.setItem("auth-token", token)
}

export function removeAuthToken(): void {
  localStorage.removeItem("auth-token")
}

// Send OTP to email for password reset
export async function sendPasswordResetOTP(email: string): Promise<{ message: string }> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hoe-be.onrender.com/api'

  const res = await fetch(`${API_URL}/auth/forgot-password/send-otp`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    let message = 'Failed to send password reset OTP'
    try {
      const err = await res.json()
      message = err?.message || err?.error || message
    } catch {}
    throw new Error(message)
  }

  const data = await res.json()
  return data
}

// Reset password with OTP
export async function resetPassword(data: {
  email: string
  otp: string
  newPassword: string
}): Promise<{ message: string }> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hoe-be.onrender.com/api'

  const res = await fetch(`${API_URL}/auth/forgot-password/reset`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword
    }),
  })

  if (!res.ok) {
    let message = 'Failed to reset password'
    try {
      const err = await res.json()
      message = err?.message || err?.error || message
    } catch {}
    throw new Error(message)
  }

  const payload = await res.json()
  return payload
}
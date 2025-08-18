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
  try {
    console.log('Sending login request with:', { email });
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to sign in');
    }

    if (!data.token) {
      throw new Error('No token received in the response');
    }

    const user: User = mapApiUserToUser(data.user ?? {});

    return { user, token: data.token };
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to sign in');
  }
}

export async function signUp(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  avatar?: string
  addresses?: Address[]
  preferences?: Partial<UserPreferences>
}): Promise<{ user: User; token: string }> {
  try {
    console.log('Sending registration request with:', { email: data.email });
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'

      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? "",
        dateOfBirth: data.dateOfBirth ?? "",
        avatar: data.avatar ?? "",
        addresses: Array.isArray(data.addresses) ? data.addresses : [],
        preferences: {
          emailNotifications: data.preferences?.emailNotifications ?? true,
          smsNotifications: data.preferences?.smsNotifications ?? true,
          marketingEmails: data.preferences?.marketingEmails ?? true,
          currency: data.preferences?.currency ?? 'USD',
          language: data.preferences?.language ?? 'en',
        },
      })
    });

    const responseData = await response.json();
    console.log('Registration API Response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      if (response.status === 400 && responseData.error?.includes('Duplicate')) {
        throw new Error('This email is already registered. Please use a different email or sign in.');
      }
      throw new Error(responseData.message || responseData.error || 'Failed to register');
    }

    if (!responseData.token) {
      throw new Error('No token received in the response');
    }

    const user: User = mapApiUserToUser(responseData.user ?? {});

    return { user, token: responseData.token };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to register');
  }
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

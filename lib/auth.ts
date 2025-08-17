import type { User } from "@/types/user"

// Mock user data for demonstration
const mockUser: User = {
  id: "1",
  email: "sarah.johnson@example.com",
  firstName: "Sarah",
  lastName: "Johnson",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1990-05-15",
  avatar: "/placeholder.svg?height=100&width=100",
  addresses: [
    {
      id: "1",
      type: "shipping",
      firstName: "Sarah",
      lastName: "Johnson",
      address1: "123 Main Street",
      address2: "Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "India",
      isDefault: true,
    },
  ],
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    currency: "USD",
    language: "en",
  },
  createdAt: "2023-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
}

export async function signIn(email: string, password: string): Promise<{ user: User; token: string }> {
  try {
    console.log('Sending login request with:', { email });
    const response = await fetch('http://localhost:5000/api/v1/users/login', {
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
      throw new Error(data.message || 'Failed to sign in');
    }

    if (!data.token) {
      throw new Error('No token received in the response');
    }

    // Since the API only returns a token, we'll create a minimal user object
    // You might want to fetch the user profile in a separate API call
    const user: User = {
      id: 'temp-id', // This will be updated after we fetch the user profile
      email,
      firstName: email.split('@')[0],
      lastName: '',
      phone: '',
      dateOfBirth: '',
      avatar: '/placeholder.svg?height=100&width=100',
      addresses: [],
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        currency: 'USD',
        language: 'en',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      user,
      token: data.token
    };
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
}): Promise<{ user: User; token: string }> {
  try {
    console.log('Sending registration request with:', { email: data.email });
    const response = await fetch('http://localhost:5000/api/v1/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'

      },
      body: JSON.stringify({
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        password: data.password
      })
    });

    const responseData = await response.json();
    console.log('Registration API Response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      if (response.status === 400 && responseData.error?.includes('Duplicate')) {
        throw new Error('This email is already registered. Please use a different email or sign in.');
      }
      throw new Error(responseData.error || 'Failed to register');
    }

    if (!responseData.token) {
      throw new Error('No token received in the response');
    }

    // Create a minimal user object with the available data
    const user: User = {
      id: 'temp-id', // Will be updated after fetching user profile
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
phone: data.phone || '',
      dateOfBirth: '',
      avatar: '/placeholder.svg?height=100&width=100',
      addresses: [],
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        currency: 'USD',
        language: 'en',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      user,
      token: responseData.token
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to register');
  }
}

export async function signOut(): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export async function getCurrentUser(): Promise<User | null> {
  // Simulate checking stored token and fetching user
  const token = localStorage.getItem("auth-token")
  if (!token) return null

  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockUser
}

export function setAuthToken(token: string): void {
  localStorage.setItem("auth-token", token)
}

export function removeAuthToken(): void {
  localStorage.removeItem("auth-token")
}

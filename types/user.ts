export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  avatar?: string
  addresses: Address[]
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  type: "shipping" | "billing"
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface UserPreferences {
  emailNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
  currency: string
  language: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

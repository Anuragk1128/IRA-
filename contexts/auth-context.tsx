"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthState } from "@/types/user"
import { getCurrentUser, signOut as authSignOut, removeAuthToken, setAuthToken } from "@/lib/auth"

interface AuthContextType extends AuthState {
  signIn: (user: User, token: string) => void
  signOut: () => Promise<void>
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await getCurrentUser()
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        })
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }

    initAuth()
  }, [])

  const signIn = (user: User, token: string) => {
    // Persist token for API usage (e.g., cart endpoints)
    try {
      setAuthToken(token)
    } catch (e) {
      console.error("Failed to persist auth token", e)
    }
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  const signOut = async () => {
    try {
      await authSignOut()
      removeAuthToken()
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const updateUser = (updates: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AdminUser, AdminAuthState } from "@/types/admin"
import { getCurrentAdmin, adminSignOut } from "@/lib/admin-auth"

interface AdminAuthContextType extends AdminAuthState {
  adminSignIn: (adminUser: AdminUser, token: string) => void
  adminSignOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({
    adminUser: null,
    isAdminAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const initAdminAuth = async () => {
      try {
        const adminUser = await getCurrentAdmin()
        setState({
          adminUser,
          isAdminAuthenticated: !!adminUser,
          isLoading: false,
        })
      } catch (error) {
        setState({
          adminUser: null,
          isAdminAuthenticated: false,
          isLoading: false,
        })
      }
    }

    initAdminAuth()
  }, [])

  const adminSignIn = (adminUser: AdminUser, token: string) => {
    setState({
      adminUser,
      isAdminAuthenticated: true,
      isLoading: false,
    })
  }

  const handleAdminSignOut = async () => {
    try {
      await adminSignOut()
      setState({
        adminUser: null,
        isAdminAuthenticated: false,
        isLoading: false,
      })
    } catch (error) {
      console.error("Admin sign out error:", error)
    }
  }

  return (
    <AdminAuthContext.Provider
      value={{
        ...state,
        adminSignIn,
        adminSignOut: handleAdminSignOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

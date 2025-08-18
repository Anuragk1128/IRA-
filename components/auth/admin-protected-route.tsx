"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAdminAuth } from "@/contexts/admin-auth-context"

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAdminAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Allow the admin login page to render without redirect
    if (pathname === "/admin/login") return

    if (!isLoading && !isAdminAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAdminAuthenticated, isLoading, router, pathname])

  // Allow the login page to always render
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    )
  }

  if (!isAdminAuthenticated) {
    return null
  }

  return <>{children}</>
}

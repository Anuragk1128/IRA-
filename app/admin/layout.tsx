import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminAuthProvider } from "@/contexts/admin-auth-context"
import { AdminProtectedRoute } from "@/components/auth/admin-protected-route"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>
        <div className="flex h-screen bg-gray-50">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </AdminProtectedRoute>
    </AdminAuthProvider>
  )
}


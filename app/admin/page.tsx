"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAdminAuthToken } from "@/lib/admin-auth"

export default function AdminDashboard() {
  const { toast } = useToast()
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true)
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true)

  const API_BASE = useMemo(() => {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "https://ira-be.onrender.com/api").replace(/\/$/, "")
  }, [])

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const token = getAdminAuthToken()
        if (!token) throw new Error("Not authenticated. Please login as admin.")
        const res = await fetch(`${API_BASE}/admin/users`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        })
        if (!res.ok) {
          let msg = `Failed to fetch users (${res.status})`
          try {
            const data = await res.json()
            msg = data?.message || data?.error || msg
          } catch {}
          throw new Error(msg)
        }
        const data = await res.json()
        const list = Array.isArray(data) ? data : data?.users || []
        setTotalUsers(list.length || 0)
      } catch (err) {
        toast({
          title: "Could not load users count",
          description: err instanceof Error ? err.message : "",
          variant: "destructive",
        })
      } finally {
        setLoadingUsers(false)
      }
    }
    fetchUsersCount()
    const fetchProductsCount = async () => {
      try {
        const token = getAdminAuthToken()
        if (!token) throw new Error("Not authenticated. Please login as admin.")
        const res = await fetch(`${API_BASE}/admin/products`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        })
        if (!res.ok) {
          let msg = `Failed to fetch products (${res.status})`
          try {
            const data = await res.json()
            msg = data?.message || data?.error || msg
          } catch {}
          throw new Error(msg)
        }
        const data = await res.json()
        const list = Array.isArray(data) ? data : data?.products || []
        setTotalProducts(list.length || 0)
      } catch (err) {
        toast({
          title: "Could not load products count",
          description: err instanceof Error ? err.message : "",
          variant: "destructive",
        })
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProductsCount()
  }, [API_BASE, toast])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview from live backend data</p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <Users className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingUsers ? "..." : totalUsers.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <Package className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingProducts ? "..." : totalProducts.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockProducts, mockUsers } from "@/lib/mockData"

export default function AdminDashboard() {
  const { toast } = useToast()
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true)
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true)

  useEffect(() => {
    // Local counts from mocks
    setTotalUsers(mockUsers.length)
    setLoadingUsers(false)
    setTotalProducts(mockProducts.length)
    setLoadingProducts(false)
  }, [toast])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview from local demo data</p>
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

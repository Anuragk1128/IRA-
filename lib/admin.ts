import type { AdminStats, SalesData, AdminUser } from "@/types/admin"

export const getAdminStats = (): AdminStats => {
  // Mock data - in real app, fetch from API
  return {
    totalOrders: 1247,
    totalRevenue: 89650,
    totalProducts: 156,
    totalUsers: 2834,
    pendingOrders: 23,
    lowStockProducts: 8,
  }
}

export const getSalesData = (): SalesData[] => {
  // Mock sales data for the last 7 days
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push({
      date: date.toISOString().split("T")[0],
      revenue: Math.floor(Math.random() * 5000) + 2000,
      orders: Math.floor(Math.random() * 50) + 20,
    })
  }
  return dates
}

export const getAdminUsers = (): AdminUser[] => {
  return [
    {
      id: "1",
      email: "admin@jewelry.com",
      role: "admin",
      name: "Sarah Johnson",
      lastLogin: "2024-01-15T10:30:00Z",
      status: "active",
    },
    {
      id: "2",
      email: "manager@jewelry.com",
      role: "manager",
      name: "Mike Chen",
      lastLogin: "2024-01-14T16:45:00Z",
      status: "active",
    },
    {
      id: "3",
      email: "staff@jewelry.com",
      role: "staff",
      name: "Emma Davis",
      lastLogin: "2024-01-13T09:15:00Z",
      status: "inactive",
    },
  ]
}

export const isAdmin = (userRole?: string): boolean => {
  return userRole === "admin" || userRole === "manager"
}

import type { AdminStats, SalesData, AdminUser } from "@/types/admin"

// Placeholder functions for API integration. These return empty, non-breaking values.
// Replace implementations with real API calls when ready.

export const getAdminStats = (): AdminStats => {
  return {
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  }
}

export const getSalesData = (): SalesData[] => {
  return []
}

export const getAdminUsers = (): AdminUser[] => {
  return []
}

export const isAdmin = (userRole?: string): boolean => {
  return userRole === "admin" || userRole === "manager"
}

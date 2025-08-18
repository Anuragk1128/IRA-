"use client"

import { useState } from "react"
import { Search, MoreHorizontal, UserPlus, Mail, Phone, Calendar, Shield, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock user data
const users = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    role: "customer",
    joinDate: "2024-01-15",
    orders: 12,
    totalSpent: 2450.0,
    lastActive: "2024-01-20",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    role: "customer",
    joinDate: "2024-01-10",
    orders: 8,
    totalSpent: 1890.0,
    lastActive: "2024-01-19",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1 (555) 345-6789",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "inactive",
    role: "customer",
    joinDate: "2023-12-20",
    orders: 3,
    totalSpent: 567.0,
    lastActive: "2024-01-05",
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@jewelrystore.com",
    phone: "+1 (555) 456-7890",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    role: "admin",
    joinDate: "2023-11-01",
    orders: 0,
    totalSpent: 0,
    lastActive: "2024-01-20",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "banned":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "customer":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage customer accounts and permissions</p>
        </div>
        <Button className="bg-rose-600 hover:bg-rose-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
            <p className="text-xs text-green-600">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-blue-600">January 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
            <p className="text-xs text-gray-600">System administrators</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all users in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {user.joinDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div className="font-medium">{user.orders} orders</div>
                    <div className="text-gray-600">${user.totalSpent.toFixed(2)} spent</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>View Orders</DropdownMenuItem>
                      <DropdownMenuItem>Send Email</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.role !== "admin" && (
                        <>
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="w-4 h-4 mr-2" />
                            Ban User
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

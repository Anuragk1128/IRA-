"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock analytics data
const salesData = [
  { month: "Jan", sales: 12500, orders: 45, customers: 32 },
  { month: "Feb", sales: 15800, orders: 52, customers: 41 },
  { month: "Mar", sales: 18200, orders: 61, customers: 48 },
  { month: "Apr", sales: 22100, orders: 73, customers: 55 },
  { month: "May", sales: 19800, orders: 68, customers: 52 },
  { month: "Jun", sales: 25400, orders: 84, customers: 67 },
  { month: "Jul", sales: 28900, orders: 95, customers: 74 },
  { month: "Aug", sales: 31200, orders: 102, customers: 81 },
  { month: "Sep", sales: 27800, orders: 89, customers: 69 },
  { month: "Oct", sales: 33500, orders: 108, customers: 86 },
  { month: "Nov", sales: 38200, orders: 125, customers: 98 },
  { month: "Dec", sales: 42800, orders: 142, customers: 112 },
]

const categoryData = [
  { name: "Necklaces", value: 35, sales: 89500 },
  { name: "Earrings", value: 28, sales: 71600 },
  { name: "Bracelets", value: 20, sales: 51200 },
  { name: "Rings", value: 12, sales: 30720 },
  { name: "Anklets", value: 5, sales: 12800 },
]

const topProducts = [
  { name: "Rose Gold Heart Necklace", sales: 156, revenue: 23400 },
  { name: "Diamond Stud Earrings", sales: 134, revenue: 20100 },
  { name: "Pearl Bracelet Set", sales: 98, revenue: 14700 },
  { name: "Vintage Ring Collection", sales: 87, revenue: 13050 },
  { name: "Crystal Drop Earrings", sales: 76, revenue: 11400 },
]

const COLORS = ["#e11d48", "#f97316", "#eab308", "#22c55e", "#3b82f6"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("12months")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$324,800</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,142</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">112</div>
            <p className="text-xs text-red-600 flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance over the last year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]} />
                <Area type="monotone" dataKey="sales" stroke="#e11d48" fill="#e11d48" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders & Customers</CardTitle>
            <CardDescription>Monthly orders and new customer acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#e11d48" strokeWidth={2} />
                <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(value) => [value, "Sales"]} />
                <Bar dataKey="sales" fill="#e11d48" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Revenue by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">${category.sales.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">{category.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest business activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="text-sm">
                  <div className="font-medium">New order #1234</div>
                  <div className="text-gray-600">2 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="text-sm">
                  <div className="font-medium">Customer registered</div>
                  <div className="text-gray-600">15 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <div className="text-sm">
                  <div className="font-medium">Product updated</div>
                  <div className="text-gray-600">1 hour ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <div className="text-sm">
                  <div className="font-medium">Payment received</div>
                  <div className="text-gray-600">2 hours ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Order Value</span>
                <span className="font-bold">$284.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="font-bold">3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Return Rate</span>
                <span className="font-bold">2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="font-bold">4.8/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inventory Turnover</span>
                <span className="font-bold">6.2x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { Package, Heart, Settings, LogOut, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { ProfileSettings } from "./profile-settings"
import { AddressBook } from "./address-book"

export function AccountDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-elegant text-foreground">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Items saved</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,234</div>
                <p className="text-xs text-muted-foreground">This year</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={user.avatar || "/placeholder.svg?height=64&width=64"}
                      alt={`${user.firstName} ${user.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("profile")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest purchases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #12345</p>
                      <p className="text-sm text-muted-foreground">Rose Gold Necklace</p>
                    </div>
                    <Badge>Delivered</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #12344</p>
                      <p className="text-sm text-muted-foreground">Diamond Earrings</p>
                    </div>
                    <Badge variant="secondary">Processing</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #12343</p>
                      <p className="text-sm text-muted-foreground">Pearl Bracelet</p>
                    </div>
                    <Badge>Delivered</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("orders")}>
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and track your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((order) => (
                  <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Order #{12340 + order}</p>
                      <p className="text-sm text-muted-foreground">Placed on Jan {order + 10}, 2024</p>
                      <p className="text-sm">2 items • $156.98</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={order % 2 === 0 ? "default" : "secondary"}>
                        {order % 2 === 0 ? "Delivered" : "Processing"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>Items you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="border rounded-lg p-4 space-y-3">
                    <div className="aspect-square bg-muted rounded-lg"></div>
                    <div>
                      <h3 className="font-medium">Elegant Necklace {item}</h3>
                      <p className="text-sm text-muted-foreground">$89.99</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Add to Cart
                      </Button>
                      <Button size="sm" variant="outline">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <AddressBook />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

export function AddressBook() {
  const { user } = useAuth()
  const [addresses] = useState(user?.addresses || [])

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-elegant">Address Book</h2>
          <p className="text-muted-foreground">Manage your shipping and billing addresses</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {address.firstName} {address.lastName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {address.isDefault && <Badge>Default</Badge>}
                  <Badge variant="outline" className="capitalize">
                    {address.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-1">
                {address.company && <p className="font-medium">{address.company}</p>}
                <p>{address.address1}</p>
                {address.address2 && <p>{address.address2}</p>}
                <p>
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p>{address.country}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {addresses.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No addresses saved yet</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

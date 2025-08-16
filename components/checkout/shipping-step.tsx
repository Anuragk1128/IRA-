"use client"

import { useState } from "react"
import { Plus, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AddressForm } from "./address-form"
import { useCheckout } from "@/contexts/checkout-context"
import { useAuth } from "@/contexts/auth-context"
import type { Address } from "@/types/order"

export function ShippingStep() {
  const { user } = useAuth()
  const { checkoutState, setShippingAddress, setBillingAddress, setSameAsBilling, setStep } = useCheckout()
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [sameAsBilling, setSameAsBillingLocal] = useState(checkoutState.sameAsBilling)

  const addresses = user?.addresses || []

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId)
    const address = addresses.find((addr) => addr.id === addressId)
    if (address) {
      setShippingAddress(address)
      if (sameAsBilling) {
        setBillingAddress({ ...address, type: "billing" })
      }
    }
  }

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBillingLocal(checked)
    setSameAsBilling(checked)
    if (checked && checkoutState.shippingAddress) {
      setBillingAddress({ ...checkoutState.shippingAddress, type: "billing" })
    }
  }

  const handleAddressAdd = (address: Address) => {
    setShippingAddress(address)
    if (sameAsBilling) {
      setBillingAddress({ ...address, type: "billing" })
    }
    setShowAddressForm(false)
  }

  const handleContinue = () => {
    if (checkoutState.shippingAddress) {
      setStep("payment")
    }
  }

  if (showAddressForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add New Address</CardTitle>
        </CardHeader>
        <CardContent>
          <AddressForm onSave={handleAddressAdd} onCancel={() => setShowAddressForm(false)} />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length > 0 ? (
            <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelect}>
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={address.id} className="cursor-pointer">
                      <div className="font-medium">
                        {address.firstName} {address.lastName}
                      </div>
                      {address.company && <div className="text-sm text-muted-foreground">{address.company}</div>}
                      <div className="text-sm text-muted-foreground">
                        {address.address1}
                        {address.address2 && `, ${address.address2}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {address.city}, {address.state} {address.zipCode}
                      </div>
                      <div className="text-sm text-muted-foreground">{address.country}</div>
                      {address.phone && <div className="text-sm text-muted-foreground">{address.phone}</div>}
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No saved addresses found</p>
            </div>
          )}

          <Button variant="outline" onClick={() => setShowAddressForm(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Checkbox id="sameAsBilling" checked={sameAsBilling} onCheckedChange={handleSameAsBillingChange} />
            <Label htmlFor="sameAsBilling" className="text-sm">
              Billing address is the same as shipping address
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={!checkoutState.shippingAddress}>
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}

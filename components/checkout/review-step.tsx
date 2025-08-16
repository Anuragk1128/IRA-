"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCheckout } from "@/contexts/checkout-context"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { createOrder } from "@/lib/orders"
import { useToast } from "@/hooks/use-toast"

export function ReviewStep() {
  const { checkoutState, setStep } = useCheckout()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const handlePlaceOrder = async () => {
    if (!user || !checkoutState.shippingAddress || !checkoutState.paymentMethod) {
      toast({
        title: "Missing information",
        description: "Please complete all checkout steps.",
        variant: "destructive",
      })
      return
    }

    setIsPlacingOrder(true)

    try {
      await createOrder(
        user.id,
        cart.items,
        checkoutState.shippingAddress,
        checkoutState.billingAddress || checkoutState.shippingAddress,
        checkoutState.paymentMethod,
      )

      clearCart()
      setStep("complete")

      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      })
    } catch (error) {
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Material: {item.material}</p>
                    <p>Color: {item.color}</p>
                    {item.size && <p>Size: {item.size}</p>}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Qty: {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({cart.itemCount} items)</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {cart.shipping === 0 ? <span className="text-green-600">Free</span> : `$${cart.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${cart.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            {checkoutState.shippingAddress && (
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {checkoutState.shippingAddress.firstName} {checkoutState.shippingAddress.lastName}
                </p>
                {checkoutState.shippingAddress.company && <p>{checkoutState.shippingAddress.company}</p>}
                <p>{checkoutState.shippingAddress.address1}</p>
                {checkoutState.shippingAddress.address2 && <p>{checkoutState.shippingAddress.address2}</p>}
                <p>
                  {checkoutState.shippingAddress.city}, {checkoutState.shippingAddress.state}{" "}
                  {checkoutState.shippingAddress.zipCode}
                </p>
                <p>{checkoutState.shippingAddress.country}</p>
                {checkoutState.shippingAddress.phone && <p>{checkoutState.shippingAddress.phone}</p>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            {checkoutState.paymentMethod && (
              <div className="text-sm space-y-1">
                {checkoutState.paymentMethod.type === "credit_card" && (
                  <>
                    <p className="font-medium">Credit Card</p>
                    <p>{checkoutState.paymentMethod.cardNumber}</p>
                    <p>{checkoutState.paymentMethod.cardholderName}</p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("payment")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payment
        </Button>
        <Button onClick={handlePlaceOrder} disabled={isPlacingOrder} size="lg">
          {isPlacingOrder && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isPlacingOrder ? "Placing Order..." : `Place Order - $${cart.total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  )
}

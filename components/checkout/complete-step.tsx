"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCheckout } from "@/contexts/checkout-context"
import { getUserOrders } from "@/lib/orders"
import { useAuth } from "@/contexts/auth-context"
import type { Order } from "@/types/order"

export function CompleteStep() {
  const { resetCheckout } = useCheckout()
  const { user } = useAuth()
  const [latestOrder, setLatestOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchLatestOrder = async () => {
      if (user) {
        const orders = await getUserOrders(user.id)
        if (orders.length > 0) {
          setLatestOrder(orders[0])
        }
      }
    }

    fetchLatestOrder()
  }, [user])

  const handleContinueShopping = () => {
    resetCheckout()
  }

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="space-y-4">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
        <h2 className="text-2xl font-elegant text-foreground">Order Confirmed!</h2>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been successfully placed and is being processed.
        </p>
      </div>

      {latestOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Number:</span>
              <span className="font-mono">{latestOrder.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="font-semibold">${latestOrder.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Estimated Delivery:</span>
              <span>{new Date(latestOrder.estimatedDelivery || "").toLocaleDateString()}</span>
            </div>
            {latestOrder.trackingNumber && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Tracking Number:</span>
                <span className="font-mono">{latestOrder.trackingNumber}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <Mail className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium mb-1">Email Confirmation</h3>
          <p className="text-sm text-muted-foreground text-center">
            A confirmation email has been sent to your email address
          </p>
        </div>
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <Package className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium mb-1">Processing</h3>
          <p className="text-sm text-muted-foreground text-center">Your order is being prepared for shipment</p>
        </div>
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <Truck className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium mb-1">Shipping</h3>
          <p className="text-sm text-muted-foreground text-center">You'll receive tracking information once shipped</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/account?tab=orders">View Order Details</Link>
        </Button>
        <Button variant="outline" onClick={handleContinueShopping} asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}

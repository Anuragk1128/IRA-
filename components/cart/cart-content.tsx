"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

export function CartContent() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const { toast } = useToast()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId)
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-elegant text-foreground mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Button asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-elegant text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground">{cart.itemCount} items in your cart</p>
        </div>
        <Button variant="outline" onClick={handleClearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Material: {item.material}</p>
                          <p>Color: {item.color}</p>
                          {item.size && <p>Size: {item.size}</p>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.productId, item.name)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                        {item.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${(item.originalPrice * item.quantity).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {!item.inStock && (
                      <div className="text-sm text-destructive">This item is currently out of stock</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
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
                    {cart.shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${cart.shipping.toFixed(2)}`
                    )}
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

              {cart.subtotal < 100 && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  Add ${(100 - cart.subtotal).toFixed(2)} more for free shipping!
                </div>
              )}

              <div className="space-y-2">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getCartAPI, type ApiCartItem } from "@/lib/cart"

export function CartContent() {
  const { toast } = useToast()
  const [items, setItems] = useState<ApiCartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const computeTotals = (its: ApiCartItem[]) => {
    const subtotal = its.reduce((sum, it) => sum + (Number(it.price ?? 0) * Number(it.quantity ?? 0)), 0)
    const itemCount = its.reduce((sum, it) => sum + Number(it.quantity ?? 0), 0)
    const tax = subtotal * 0.1 // placeholder 10%
    const shipping = subtotal >= 100 ? 0 : 9.99
    const total = subtotal + tax + shipping
    return { subtotal, itemCount, tax, shipping, total }
  }

  const [totals, setTotals] = useState(() => computeTotals([]))

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        const data = await getCartAPI()
        if (!mounted) return
        setItems(data.items)
        const computed = computeTotals(data.items)
        setTotals({
          subtotal: typeof data.subtotal === "number" ? data.subtotal : computed.subtotal,
          itemCount: typeof data.itemCount === "number" ? data.itemCount : computed.itemCount,
          tax: typeof data.tax === "number" ? data.tax : computed.tax,
          shipping: typeof data.shipping === "number" ? data.shipping : computed.shipping,
          total: typeof data.total === "number" ? data.total : computed.total,
        })
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : "Failed to load cart")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleQuantityChange = (_productId: string, _newQuantity: number) => {
    toast({ title: "Not available", description: "Quantity update will be enabled soon." })
  }

  const handleRemoveItem = (_productId: string, productName: string) => {
    toast({ title: "Not available", description: `${productName} removal will be enabled soon.` })
  }

  const handleClearCart = () => {
    toast({ title: "Not available", description: "Clearing cart will be enabled soon." })
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-elegant text-foreground mb-2">Loading your cart…</h1>
        <p className="text-muted-foreground">Please wait</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-2xl font-elegant text-foreground mb-2">Unable to load cart</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/account">Sign in</Link>
          </Button>
          <Button variant="outline" onClick={() => location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
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
          <p className="text-muted-foreground">{totals.itemCount} items in your cart</p>
        </div>
        <Button variant="outline" onClick={handleClearCart} disabled>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name || "Cart item"} fill className="object-cover" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {item.name || "Product"}
                        </Link>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {item.material && <p>Material: {item.material}</p>}
                          {item.color && <p>Color: {item.color}</p>}
                          {item.size && <p>Size: {item.size}</p>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.productId, item.name || "Product")}
                        className="text-muted-foreground"
                        disabled
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
                          onClick={() => handleQuantityChange(item.productId, (item.quantity ?? 1) - 1)}
                          disabled
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity ?? 1}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => handleQuantityChange(item.productId, (item.quantity ?? 1) + 1)}
                          disabled
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">${((Number(item.price ?? 0)) * (Number(item.quantity ?? 1))).toFixed(2)}</div>
                        {typeof item.originalPrice === "number" && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${((Number(item.originalPrice)) * (Number(item.quantity ?? 1))).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {item.inStock === false && (
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
                  <span>Subtotal ({totals.itemCount} items)</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {totals.shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${totals.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>

              {totals.subtotal < 100 && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  Add ${(100 - totals.subtotal).toFixed(2)} more for free shipping!
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

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { formatCurrencyINR } from "@/lib/currency"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface CartItem {
  _id: string
  user: string
  product: {
    _id: string
    brandId?: string
    title: string
    slug: string
    images: string[]
    price: number
    gstRate: number
    taxAmount: number
    priceIncludingTax: number
    inStock: boolean
    isLowStock: boolean
    stock?: number
    id: string
  } | null
  quantity: number
  createdAt: string
  updatedAt: string
}

// Jerseymise brand ID to filter out
const JERSEYMISE_BRAND_ID = '68b6dbf0979adf12e46f273c'

export function CartContent() { 
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Fetch cart items
  const fetchCartItems = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    try {
      const token = localStorage.getItem("auth-token")
      if (!token) {
        router.push('/login')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hoe-be.onrender.com/api'
      const response = await fetch(`${API_URL}/cart`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const items = await response.json()
        // Filter out items with null products and Jerseymise brand products
        const validItems = items.filter((item: CartItem) => 
          item.product !== null && 
          item.product.brandId !== JERSEYMISE_BRAND_ID
        )
        setCartItems(validItems)
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to load cart items',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching cart items:', error)
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Add one quantity to cart item
  const addToCart = async (item: CartItem) => {
    if (!item.product) return
    
    // Check if product is in stock
    if (!item.product.inStock) {
      toast({
        title: 'Out of Stock',
        description: 'This item is currently out of stock',
        variant: 'destructive'
      })
      return
    }

    // Check stock quantity limitations
    const availableStock = item.product.stock || 0
    const currentQuantity = item.quantity
    
    // If we have stock information, check if we can add more
    if (availableStock > 0 && currentQuantity >= availableStock) {
      toast({
        title: 'Stock Limited',
        description: `Only ${availableStock} item${availableStock > 1 ? 's' : ''} available in stock`,
        variant: 'destructive'
      })
      return
    }

    // If product has low stock warning and we already have 1 item
    if (item.product.isLowStock && currentQuantity >= 1) {
      toast({
        title: 'Stock Limited',
        description: 'Only 1 item available due to low stock',
        variant: 'destructive'
      })
      return
    }

    setUpdating(item._id)
    try {
      const token = localStorage.getItem("auth-token")
      if (!token) return

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hoe-be.onrender.com/api'
      const response = await fetch(`${API_URL}/cart/${item.product._id}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: 1 })
      })

      if (response.ok) {
        // Update local state - increase quantity by 1
        setCartItems(prev => prev.map(cartItem => {
          if (cartItem._id === item._id) {
            return { ...cartItem, quantity: cartItem.quantity + 1 }
          }
          return cartItem
        }))
        
        toast({
          title: 'Added',
          description: 'Item quantity increased',
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to add item',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setUpdating(null)
    }
  }

  // Update item quantity (decrease by 1)
  const decreaseQuantity = async (item: CartItem) => {
    if (!item.product) return
    
    setUpdating(item._id)
    try {
      const token = localStorage.getItem("auth-token")
      if (!token) return

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hoe-be.onrender.com/api'
      const response = await fetch(`${API_URL}/cart/${item.product._id}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: 1 })
      })

      if (response.ok) {
        // Update local state - decrease quantity by 1
        setCartItems(prev => prev.map(cartItem => {
          if (cartItem._id === item._id) {
            const newQuantity = cartItem.quantity - 1
            if (newQuantity <= 0) {
              // Remove item completely if quantity becomes 0
              return null
            }
            return { ...cartItem, quantity: newQuantity }
          }
          return cartItem
        }).filter(Boolean) as CartItem[])
        
        toast({
          title: 'Updated',
          description: 'Item quantity decreased',
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to update quantity',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setUpdating(null)
    }
  }

  // Remove item completely from cart
  const removeItem = async (item: CartItem) => {
    if (!item.product) return
    
    setUpdating(item._id)
    try {
      const token = localStorage.getItem("auth-token")
      if (!token) return

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hoe-be.onrender.com/api'
      const response = await fetch(`${API_URL}/cart/${item.product._id}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: item.quantity })
      })

      if (response.ok) {
        // Remove from local state
        setCartItems(prev => prev.filter(cartItem => cartItem._id !== item._id))
        toast({
          title: 'Removed',
          description: 'Item removed from cart',
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to remove item',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error removing item:', error)
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setUpdating(null)
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [isAuthenticated])

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    if (!item.product) return sum
    return sum + (item.product.price * item.quantity)
  }, 0)

  const totalTax = cartItems.reduce((sum, item) => {
    if (!item.product) return sum
    return sum + (item.product.taxAmount * item.quantity)
  }, 0)

  const totalWithTax = cartItems.reduce((sum, item) => {
    if (!item.product) return sum
    return sum + (item.product.priceIncludingTax * item.quantity)
  }, 0)

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Badge variant="secondary">{totalItems} {totalItems === 1 ? 'item' : 'items'}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            if (!item.product) return null
            
            return (
              <Card key={item._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.product.images[0] || '/placeholder.svg'}
                        alt={item.product.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {item.product.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrencyINR(item.product.priceIncludingTax)}
                        </span>
                        <div className="flex items-center gap-2">
                          
                          {item.product.stock && (
                            <Badge variant="outline">
                              {item.product.stock} available
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => decreaseQuantity(item)}
                            disabled={updating === item._id || item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 min-w-[3rem] text-center">
                            {updating === item._id ? '...' : item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addToCart(item)}
                            disabled={
                              updating === item._id || 
                              !item.product.inStock || 
                              (item.product.isLowStock && item.quantity >= 1) ||
                              (item.product.stock ? item.quantity >= item.product.stock : false)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item)}
                          disabled={updating === item._id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Item Total</p>
                      <p className="text-xl font-bold">
                        {formatCurrencyINR(item.product.priceIncludingTax * item.quantity)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatCurrencyINR(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrencyINR(totalTax)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrencyINR(totalWithTax)}</span>
              </div>
              
              <Link href="https://houseofevolve.in/cart" target="_blank">

              <Button className="w-full" size="lg"
              >
                Proceed to Checkout
              </Button>
              </Link>

              <Button variant="outline" className="w-full" onClick={() => router.push('/products')}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
        </div>
    )
}
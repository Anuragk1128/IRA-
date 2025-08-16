"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Cart, CartItem } from "@/types/cart"
import type { Product } from "@/types/product"

interface CartContextType {
  cart: Cart
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
  getCartItemQuantity: (productId: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const TAX_RATE = 0.08 // 8% tax
const FREE_SHIPPING_THRESHOLD = 100
const SHIPPING_COST = 9.99

function calculateCartTotals(items: CartItem[]): Omit<Cart, "items"> {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * TAX_RATE
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + tax + shipping
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount,
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    itemCount: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("luxe-jewelry-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        const totals = calculateCartTotals(parsedCart.items || [])
        setCart({
          items: parsedCart.items || [],
          ...totals,
        })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("luxe-jewelry-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((item) => item.productId === product.id)

      let newItems: CartItem[]

      if (existingItem) {
        // Update quantity of existing item
        newItems = prevCart.items.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0] || "/placeholder.svg",
          material: product.material,
          color: product.color,
          size: product.size,
          quantity,
          inStock: product.inStock,
        }
        newItems = [...prevCart.items, newItem]
      }

      const totals = calculateCartTotals(newItems)
      return {
        items: newItems,
        ...totals,
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.productId !== productId)
      const totals = calculateCartTotals(newItems)
      return {
        items: newItems,
        ...totals,
      }
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => (item.productId === productId ? { ...item, quantity } : item))
      const totals = calculateCartTotals(newItems)
      return {
        items: newItems,
        ...totals,
      }
    })
  }

  const clearCart = () => {
    setCart({
      items: [],
      total: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      itemCount: 0,
    })
  }

  const isInCart = (productId: string) => {
    return cart.items.some((item) => item.productId === productId)
  }

  const getCartItemQuantity = (productId: string) => {
    const item = cart.items.find((item) => item.productId === productId)
    return item ? item.quantity : 0
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

import type { Order, OrderItem, Address, PaymentMethod, OrderStatus } from "@/types/order"
import type { CartItem } from "@/types/cart"

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    userId: "1",
    items: [
      {
        id: "1",
        productId: "1",
        name: "Rose Gold Layered Necklace",
        price: 89.99,
        quantity: 1,
        image: "/rose-gold-layered-necklace.png",
        material: "Rose Gold Plated",
        color: "Rose Gold",
      },
    ],
    shippingAddress: {
      id: "1",
      type: "shipping",
      firstName: "Sarah",
      lastName: "Johnson",
      address1: "123 Main Street",
      address2: "Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    billingAddress: {
      id: "1",
      type: "billing",
      firstName: "Sarah",
      lastName: "Johnson",
      address1: "123 Main Street",
      address2: "Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    paymentMethod: {
      id: "1",
      type: "credit_card",
      cardNumber: "**** **** **** 1234",
      cardholderName: "Sarah Johnson",
      isDefault: true,
    },
    subtotal: 89.99,
    tax: 7.2,
    shipping: 0,
    total: 97.19,
    status: "delivered",
    trackingNumber: "1Z999AA1234567890",
    estimatedDelivery: "2024-01-20",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-18T14:22:00Z",
  },
]

export async function createOrder(
  userId: string,
  items: CartItem[],
  shippingAddress: Address,
  billingAddress: Address,
  paymentMethod: PaymentMethod,
): Promise<Order> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const orderItems: OrderItem[] = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    material: item.material,
    color: item.color,
    size: item.size,
  }))

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const shipping = subtotal >= 100 ? 0 : 9.99
  const total = subtotal + tax + shipping

  const order: Order = {
    id: `ORD-${Date.now()}`,
    userId,
    items: orderItems,
    shippingAddress,
    billingAddress,
    paymentMethod,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
    status: "confirmed",
    trackingNumber: `1Z999AA${Math.random().toString().substr(2, 9)}`,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Add to mock orders
  mockOrders.unshift(order)

  return order
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockOrders.find((order) => order.id === orderId) || null
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockOrders.filter((order) => order.userId === userId)
}

export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "text-yellow-600 bg-yellow-50"
    case "confirmed":
      return "text-blue-600 bg-blue-50"
    case "processing":
      return "text-purple-600 bg-purple-50"
    case "shipped":
      return "text-indigo-600 bg-indigo-50"
    case "delivered":
      return "text-green-600 bg-green-50"
    case "cancelled":
      return "text-red-600 bg-red-50"
    case "refunded":
      return "text-gray-600 bg-gray-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getOrderStatusText(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Pending"
    case "confirmed":
      return "Confirmed"
    case "processing":
      return "Processing"
    case "shipped":
      return "Shipped"
    case "delivered":
      return "Delivered"
    case "cancelled":
      return "Cancelled"
    case "refunded":
      return "Refunded"
    default:
      return "Unknown"
  }
}

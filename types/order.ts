export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: OrderStatus
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  material: string
  color: string
  size?: string
}

export interface Address {
  id: string
  type: "shipping" | "billing"
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: string
  type: "credit_card" | "paypal" | "apple_pay" | "google_pay"
  cardNumber?: string
  expiryMonth?: string
  expiryYear?: string
  cvv?: string
  cardholderName?: string
  isDefault: boolean
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"

export interface CheckoutState {
  step: "shipping" | "payment" | "review" | "complete"
  shippingAddress?: Address
  billingAddress?: Address
  paymentMethod?: PaymentMethod
  sameAsBilling: boolean
}

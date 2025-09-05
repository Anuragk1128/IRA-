import { Product } from "@/types/product"
import { BackendCategory } from "./catalog"
import { User } from "@/types/user"

export const mockCategories: BackendCategory[] = [
  {
    id: "1",
    name: "Jewelry",
    description: "Exquisite handcrafted jewelry pieces",
    image: "/images/jewelry-category.jpg",
    subcategories: [
      { id: "101", name: "Necklaces", description: "Elegant neck pieces for every occasion" },
      { id: "102", name: "Bracelets", description: "Stylish bracelets to adorn your wrist" },
      { id: "103", name: "Earrings", description: "Beautiful earrings to complement your look" },
      { id: "104", name: "Rings", description: "Timeless rings for every finger" },
    ],
  },
  {
    id: "2",
    name: "Home Decor",
    description: "Elegant home decoration pieces",
    image: "/images/home-decor-category.jpg",
    subcategories: [
      { id: "201", name: "Vases", description: "Artistic vases for your flowers" },
      { id: "202", name: "Candles", description: "Aromatic candles for a cozy atmosphere" },
      { id: "203", name: "Wall Art", description: "Stunning wall decorations" },
    ],
  },
  {
    id: "3",
    name: "Gift Sets",
    description: "Thoughtfully curated gift collections",
    image: "/images/gift-sets-category.jpg",
    subcategories: [
      { id: "301", name: "Luxury Sets", description: "Premium gift sets for special occasions" },
      { id: "302", name: "Mini Collections", description: "Petite collections for gifting" },
    ],
  },
]

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Gold Plated Necklace Set",
    description: "Elegant gold plated necklace with matching earrings. Perfect for weddings and special occasions. Features intricate detailing and a comfortable fit.",
    price: 4999,
    originalPrice: 6999,
    images: ["/images/necklace-set-1.jpg", "/images/necklace-set-2.jpg", "/images/necklace-set-3.jpg"],
    category: "1",
    subcategory: "101",
    material: "Gold Plated Sterling Silver",
    color: "Gold",
    size: "Adjustable up to 18 inches",
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    tags: ["jewelry", "necklace", "gold", "earrings", "set", "bridal"],
    bestseller: true,
    featured: true,
  },
  {
    id: "p2",
    name: "Handcrafted Ceramic Vase",
    description: "Beautiful hand-painted ceramic vase that adds elegance to any room. Each piece is unique with its own artistic touch.",
    price: 2999,
    originalPrice: 3999,
    images: ["/images/vase-1.jpg", "/images/vase-2.jpg"],
    category: "2",
    subcategory: "201",
    material: "Ceramic",
    color: "White & Gold",
    inStock: true,
    rating: 4.6,
    reviewCount: 87,
    tags: ["home", "vase", "ceramic", "decor", "handmade"],
    newArrival: true,
  },
  {
    id: "p3",
    name: "Minimalist Gold Hoop Earrings",
    description: "Simple yet elegant gold hoops that go with any outfit. Lightweight and comfortable for all-day wear.",
    price: 2499,
    images: ["/images/hoops-1.jpg"],
    category: "1",
    subcategory: "103",
    material: "14K Gold Plated",
    color: "Gold",
    inStock: true,
    rating: 4.7,
    reviewCount: 215,
    tags: ["jewelry", "earrings", "hoops", "minimalist", "everyday"],
    bestseller: true,
  },
  {
    id: "p4",
    name: "Luxury Gift Box Set",
    description: "Premium gift set including a necklace, bracelet, and earrings. Presented in an elegant gift box, perfect for special occasions.",
    price: 8999,
    originalPrice: 11999,
    images: ["/images/gift-set-1.jpg", "/images/gift-set-2.jpg"],
    category: "3",
    subcategory: "301",
    material: "Gold Plated with Cubic Zirconia",
    color: "Rose Gold",
    inStock: true,
    rating: 4.9,
    reviewCount: 53,
    tags: ["gift", "set", "luxury", "jewelry", "special occasion"],
    featured: true,
  },
  {
    id: "p5",
    name: "Scented Soy Wax Candle",
    description: "Hand-poured soy wax candle with essential oils. Provides 40+ hours of burn time and fills your space with a delicate fragrance.",
    price: 1799,
    images: ["/images/candle-1.jpg"],
    category: "2",
    subcategory: "202",
    material: "Soy Wax, Essential Oils",
    color: "Cream",
    inStock: false,
    rating: 4.5,
    reviewCount: 92,
    tags: ["home", "candle", "aromatherapy", "soy wax", "scented"],
  },
]

// Find a product by ID
export function findProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id)
}

// Find products by category
export function findProductsByCategory(categoryId: string): Product[] {
  return mockProducts.filter((p) => p.category === categoryId)
}

// Get all categories
export function getAllCategories(): BackendCategory[] {
  return mockCategories
}

// Mock users for admin/users page
export const mockUsers: User[] = [
  {
    id: "u1",
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Shah",
    phone: "+91-90000-11111",
    addresses: [],
    preferences: { emailNotifications: true, smsNotifications: false, marketingEmails: true, currency: "INR", language: "en" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "u2",
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Verma",
    phone: "+91-90000-22222",
    addresses: [],
    preferences: { emailNotifications: true, smsNotifications: false, marketingEmails: true, currency: "INR", language: "en" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

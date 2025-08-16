import type { Product, ProductCategory } from "@/types/product"

export const categories: ProductCategory[] = [
  {
    id: "1",
    name: "Necklaces",
    slug: "necklaces",
    description: "Elegant necklaces for every occasion",
    image: "/placeholder-4e5qy.png",
    subcategories: [
      { id: "1", name: "Statement Necklaces", slug: "statement", description: "Bold and eye-catching pieces" },
      { id: "2", name: "Delicate Chains", slug: "delicate", description: "Subtle and refined designs" },
      { id: "3", name: "Pendant Necklaces", slug: "pendant", description: "Beautiful pendants and charms" },
    ],
  },
  {
    id: "2",
    name: "Earrings",
    slug: "earrings",
    description: "Beautiful earrings to complement any look",
    image: "/elegant-gold-earrings.png",
    subcategories: [
      { id: "4", name: "Stud Earrings", slug: "studs", description: "Classic and versatile studs" },
      { id: "5", name: "Drop Earrings", slug: "drops", description: "Graceful hanging designs" },
      { id: "6", name: "Hoop Earrings", slug: "hoops", description: "Timeless circular elegance" },
    ],
  },
  {
    id: "3",
    name: "Bracelets",
    slug: "bracelets",
    description: "Stylish bracelets and bangles",
    image: "/elegant-gold-bracelets.png",
    subcategories: [
      { id: "7", name: "Chain Bracelets", slug: "chain", description: "Classic chain designs" },
      { id: "8", name: "Bangles", slug: "bangles", description: "Traditional and modern bangles" },
      { id: "9", name: "Charm Bracelets", slug: "charm", description: "Personalized charm collections" },
    ],
  },
  {
    id: "4",
    name: "Rings",
    slug: "rings",
    description: "Stunning rings for every finger",
    image: "/elegant-gold-rings.png",
    subcategories: [
      { id: "10", name: "Statement Rings", slug: "statement", description: "Bold and dramatic designs" },
      { id: "11", name: "Stackable Rings", slug: "stackable", description: "Mix and match collections" },
      { id: "12", name: "Cocktail Rings", slug: "cocktail", description: "Perfect for special occasions" },
    ],
  },
]

export const products: Product[] = [
  {
    id: "1",
    name: "Rose Gold Layered Necklace",
    description:
      "A stunning layered necklace featuring delicate rose gold chains with crystal accents. Perfect for both casual and formal occasions.",
    price: 89.99,
    originalPrice: 129.99,
    images: ["/rose-gold-layered-necklace.png", "/rose-gold-necklace-model.png", "/rose-gold-necklace-closeup.png"],
    category: "necklaces",
    subcategory: "statement",
    material: "Rose Gold Plated",
    color: "Rose Gold",
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    tags: ["layered", "crystal", "rose-gold", "statement"],
    featured: true,
    bestseller: true,
  },
  {
    id: "2",
    name: "Diamond Stud Earrings",
    description:
      "Classic diamond stud earrings with brilliant cut crystals. Timeless elegance that complements any outfit.",
    price: 45.99,
    images: ["/placeholder-2wp4g.png", "/diamond-earrings-ear.png"],
    category: "earrings",
    subcategory: "studs",
    material: "Sterling Silver",
    color: "Silver",
    inStock: true,
    rating: 4.9,
    reviewCount: 89,
    tags: ["diamond", "stud", "classic", "crystal"],
    bestseller: true,
  },
  {
    id: "3",
    name: "Vintage Pearl Bracelet",
    description:
      "Elegant pearl bracelet with vintage-inspired design. Features lustrous artificial pearls and gold-tone accents.",
    price: 67.99,
    originalPrice: 89.99,
    images: ["/placeholder-7mt20.png", "/pearl-bracelet-wrist.png"],
    category: "bracelets",
    subcategory: "chain",
    material: "Gold Plated",
    color: "Gold",
    inStock: true,
    rating: 4.7,
    reviewCount: 56,
    tags: ["pearl", "vintage", "gold", "elegant"],
    newArrival: true,
  },
  {
    id: "4",
    name: "Emerald Statement Ring",
    description:
      "Bold emerald statement ring with intricate gold detailing. A show-stopping piece for special occasions.",
    price: 78.99,
    images: ["/emerald-statement-ring.png", "/placeholder.svg?height=600&width=600"],
    category: "rings",
    subcategory: "statement",
    material: "Gold Plated",
    color: "Gold",
    size: "Adjustable",
    inStock: true,
    rating: 4.6,
    reviewCount: 34,
    tags: ["emerald", "statement", "gold", "cocktail"],
    featured: true,
  },
  {
    id: "5",
    name: "Delicate Chain Necklace",
    description: "Minimalist gold chain necklace perfect for layering. Simple elegance for everyday wear.",
    price: 34.99,
    images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    category: "necklaces",
    subcategory: "delicate",
    material: "Gold Plated",
    color: "Gold",
    inStock: true,
    rating: 4.5,
    reviewCount: 78,
    tags: ["delicate", "minimalist", "gold", "layering"],
    newArrival: true,
  },
  {
    id: "6",
    name: "Crystal Drop Earrings",
    description:
      "Elegant drop earrings featuring cascading crystals. Perfect for evening events and special occasions.",
    price: 56.99,
    originalPrice: 79.99,
    images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    category: "earrings",
    subcategory: "drops",
    material: "Sterling Silver",
    color: "Silver",
    inStock: true,
    rating: 4.8,
    reviewCount: 92,
    tags: ["crystal", "drop", "elegant", "evening"],
    featured: true,
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

export function getBestsellerProducts(): Product[] {
  return products.filter((product) => product.bestseller)
}

export function getNewArrivalProducts(): Product[] {
  return products.filter((product) => product.newArrival)
}

export function getProducts(): Product[] {
  return products
}

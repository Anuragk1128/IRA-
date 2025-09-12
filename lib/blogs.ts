export interface BlogPost {
  slug: string
  title: string
  coverImage: string
  excerpt: string
  content: string
  date: string
  author: string
  tags: string[]
}

export const BLOGS: BlogPost[] = [
  {
    slug: "guide-to-everyday-jewellery",
    title: "A Modern Guide to Everyday Jewellery",
    coverImage: "/elegant-gold-earrings.png",
    excerpt: "Discover versatile pieces that elevate your daily style without compromising comfort.",
    content:
      "Jewellery for everyday wear should balance elegance with ease. From minimal gold-coated hoops to delicate chains, the right pieces blend seamlessly with your wardrobe. Explore how textures, finishes, and materials like stainless steel and copper coatings can achieve a luxe look that lasts.",
    date: "2025-08-01",
    author: "IRA Editorial",
    tags: ["guide", "everyday", "earrings"],
  },
  {
    slug: "styling-necklaces-for-occasions",
    title: "Styling Necklaces for Every Occasion",
    coverImage: "/rose-gold-layered-necklace.png",
    excerpt: "Layered chains, statement pendants, and dainty chokers—what to wear and when.",
    content:
      "Necklaces frame your face and transform silhouettes. For brunches, try layered rose-gold chains; for evening events, a single sculptural pendant can anchor your look. Learn pairing rules with necklines, metals, and textures to create harmonized statements.",
    date: "2025-08-10",
    author: "IRA Editorial",
    tags: ["styling", "necklaces", "occasion"],
  },
  {
    slug: "care-for-plated-jewellery",
    title: "Care Tips for Plated Jewellery",
    coverImage: "/minimalist-jewelry.png",
    excerpt: "Keep shine longer—smart routines to preserve finish and form.",
    content:
      "Plated jewellery can retain its brilliance with a few simple habits: avoid harsh chemicals, store pieces separately, and wipe with a soft microfiber after wear. We share do's and don'ts, plus storage hacks for travel.",
    date: "2025-08-18",
    author: "IRA Care Lab",
    tags: ["care", "maintenance", "plated"],
  },
  {
    slug: "earrings-that-complement-your-face-shape",
    title: "Earrings That Complement Your Face Shape",
    coverImage: "/elegant-gold-earrings.png",
    excerpt: "Find silhouettes that balance and enhance your natural features.",
    content:
      "Hoops, drops, studs, and crescents each bring unique balance. Oval faces welcome most silhouettes; rounds favor elongated lines; heart shapes shine with teardrops. We break down proportions and finishes to help you choose with confidence.",
    date: "2025-08-22",
    author: "IRA Stylists",
    tags: ["earrings", "face-shape", "styling"],
  },
  {
    slug: "bracelets-and-bangles-stack-like-a-pro",
    title: "Bracelets & Bangles: Stack Like a Pro",
    coverImage: "/elegant-gold-bracelets.png",
    excerpt: "Textures, widths, and metals—how to stack without clutter.",
    content:
      "Balance is key: mix two to three textures, vary widths, and anchor with a sleek bangle. Introduce a pop element like a charm or a matte finish to break monotony. We show curated stacks for work, weekends, and festivities.",
    date: "2025-08-25",
    author: "IRA Stylists",
    tags: ["bracelets", "stacking", "style"],
  },
  {
    slug: "rings-size-fit-and-comfort",
    title: "Rings: Size, Fit, and Comfort",
    coverImage: "/elegant-gold-rings.png",
    excerpt: "Choosing the perfect ring fit for all-day wear.",
    content:
      "Great rings disappear on the hand. Measure at different times of day, consider band width, and choose rounded inner edges for comfort. We outline a quick sizing checklist and how materials affect feel.",
    date: "2025-08-28",
    author: "IRA Care Lab",
    tags: ["rings", "sizing", "comfort"],
  },
  {
    slug: "festive-edit-top-picks",
    title: "Festive Edit: Top Picks",
    coverImage: "/pearl-bridal-jewelry.png",
    excerpt: "Our bestsellers for celebrations—timeless pieces with modern detail.",
    content:
      "From pearl-kissed accents to polished gold crescents, our festive edit blends tradition and minimalism. Explore pieces that photograph beautifully and wear comfortably through long events.",
    date: "2025-09-01",
    author: "IRA Editorial",
    tags: ["festive", "bestsellers", "edit"],
  },
  {
    slug: "workday-to-weekend-transition",
    title: "Workday to Weekend: Seamless Jewellery Transitions",
    coverImage: "/minimalist-jewelry.png",
    excerpt: "Switch looks with a single swap—smart pieces that multitask.",
    content:
      "A slim chain and stud set for the day can evolve with a bold pendant or crescent earrings for evening. We suggest modular pieces and quick styling flips to keep your routine effortless.",
    date: "2025-09-05",
    author: "IRA Stylists",
    tags: ["workwear", "weekend", "versatile"],
  },
  {
    slug: "gifting-jewellery-that-delights",
    title: "Gifting Jewellery That Delights",
    coverImage: "/rose-gold-necklace-closeup.png",
    excerpt: "Thoughtful, timeless gifts across styles and budgets.",
    content:
      "Consider their daily style: minimalists love clean lines; romantics lean towards pearls and curves. Include care notes and a personal message to make it memorable. Our curated list spans every personality.",
    date: "2025-09-08",
    author: "IRA Editorial",
    tags: ["gifting", "guide", "curation"],
  },
  {
    slug: "why-we-love-stainless-steel",
    title: "Why We Love Stainless Steel",
    coverImage: "/stainless-steel.png",
    excerpt: "Durable, skin-friendly, and beautifully finished—meet your new everyday ally.",
    content:
      "Stainless steel offers strength and a refined sheen, resisting tarnish while keeping designs light and wearable. Learn about finishes, coatings, and how to maintain that new-piece gleam.",
    date: "2025-09-10",
    author: "IRA Care Lab",
    tags: ["materials", "steel", "everyday"],
  },
]

export function getBlogs(limit?: number): BlogPost[] {
  return typeof limit === "number" ? BLOGS.slice(0, Math.max(0, limit)) : BLOGS
}

export function findBlog(slug: string): BlogPost | undefined {
  return BLOGS.find((b) => b.slug === slug)
}


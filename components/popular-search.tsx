"use client"

import Link from "next/link"

export interface PopularSearchItem {
  label: string
  query: string
  href?: string
}

interface PopularSearchesProps {
  title?: string
  items?: PopularSearchItem[]
  // Optional size: small chips vs buttons
  variant?: "chip" | "button"
}

const defaultItems: PopularSearchItem[] = [
  { label: "Delicate necklaces", query: "delicate necklaces" },
  { label: "Stud earrings", query: "stud earrings" },
  { label: "Bracelets", query: "bracelets" },
  { label: "Gold coated", query: "gold coated" },
  { label: "Silver coated", query: "silver coated" },
]

export default function PopularSearches({
  title = "Popular searches",
  items = defaultItems,
  variant = "chip",
}: PopularSearchesProps) {
  return (
    <div className="w-full">
      <div className="text-xl  font-bold uppercase  text-muted-foreground mb-2">
        {title}
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const href = item.href ?? `/search?q=${encodeURIComponent(item.query)}`
          return (
            <Link
              key={item.label}
              href={href}
              className={
                variant === "chip"
                  ? "inline-flex items-center rounded-full border border-black/20 px-3 py-1 text-xs hover:bg-black hover:text-white transition-colors"
                  : "inline-flex items-center rounded-md border border-black px-3 py-1.5 text-sm hover:bg-black hover:text-white transition-colors"
              }
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
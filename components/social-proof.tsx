"use client"

import Image from "next/image"

type Testimonial = {
  name: string
  avatar: string
  title?: string
  rating: number
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: "Aarav S.",
    avatar: "/avatars/1.png",
    title: "Bengaluru",
    rating: 5,
    quote:
      "Exceptional craftsmanship! The ring exceeded my expectations and arrived earlier than promised.",
  },
  {
    name: "Meera K.",
    avatar: "/avatars/2.png",
    title: "Mumbai",
    rating: 5,
    quote:
      "I love the minimal design. It feels premium and comfortable for daily wear.",
  },
  {
    name: "Ishaan R.",
    avatar: "/avatars/3.png",
    title: "Gurugram",
    rating: 4,
    quote:
      "Beautiful necklace and great packaging. Customer support was super helpful!",
  },
  {
    name: "Sara D.",
    avatar: "/avatars/4.png",
    title: "Pune",
    rating: 5,
    quote:
      "This is my second purchase from IRA. Quality and finish are consistently amazing.",
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={i < rating ? "currentColor" : "none"}
          className={`h-4 w-4 ${i < rating ? "" : "text-muted-foreground/30"}`}
        >
          <path
            stroke="currentColor"
            strokeWidth="1.2"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
    </div>
  )
}

export function SocialProof() {
  return (
    <section className="relative py-12 sm:py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Loved by our customers
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Real stories from people who chose IRA.
          </p>
          <div className="mx-auto mt-5 h-px w-20 bg-border" />
        </div>

        {/* Stats row */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 text-center">
          <div className="rounded-lg border border-border/70 bg-card/60 p-3">
            <div className="text-xl font-semibold">4.8/5</div>
            <div className="text-xs text-muted-foreground">Average rating</div>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/60 p-3">
            <div className="text-xl font-semibold">10k+</div>
            <div className="text-xs text-muted-foreground">Happy customers</div>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/60 p-3">
            <div className="text-xl font-semibold">Free</div>
            <div className="text-xs text-muted-foreground">Easy returns</div>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/60 p-3">
            <div className="text-xl font-semibold">Secure</div>
            <div className="text-xs text-muted-foreground">Payments</div>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/60 p-3">
            <div className="text-xl font-semibold">Assured</div>
            <div className="text-xs text-muted-foreground">Warranty</div>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/60 p-3">
            <div className="text-xl font-semibold">Pan-India</div>
            <div className="text-xs text-muted-foreground">Delivery</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative rounded-2xl border border-border bg-card/60 p-5 sm:p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-border/60 bg-muted">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <div className="font-medium leading-tight">{t.name}</div>
                  {t.title && (
                    <div className="text-xs text-muted-foreground">{t.title}</div>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <Stars rating={t.rating} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">“{t.quote}”</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="rounded-md border border-border bg-card/50 px-3 py-1">Verified reviews</span>
          <span className="rounded-md border border-border bg-card/50 px-3 py-1">Secure checkout</span>
          <span className="rounded-md border border-border bg-card/50 px-3 py-1">Insured shipping</span>
        </div>
      </div>
    </section>
  )
}

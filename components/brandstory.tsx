"use client"

import Image from "next/image"
import Link from "next/link"

export default function BrandStory() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 bg-gradient-to-b from-background via-background to-muted/30">
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Brand Story</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Crafted with passion, guided by heritage. Discover what makes IRA unique.
            </p>
            <div className="mx-auto mt-5 h-px w-20 bg-border" />
          </div>

          {/* Content card */}
          <div className="grid items-center gap-6 sm:gap-8 md:grid-cols-2 rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 sm:p-6 md:p-8 shadow-sm">
            {/* Image side */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-border/70">
              <Image
                src="/elegant-gold-rings.png"
                alt="Craftsmanship and elegance"
                fill
                className="object-cover transition-transform duration-500 will-change-transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
            </div>

            {/* Text side */}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold">Timeless Craft. Modern Design.</h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                At IRA, every piece is a narrative — of artisanship, precision, and emotion. We blend
                contemporary aesthetics with traditional techniques to create jewelry that feels intimate and
                looks iconic.
              </p>

              <ul className="mt-5 grid gap-3 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-primary/70" />
                  Ethically sourced materials and thoughtfully designed collections.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-accent/70" />
                  Hand-finished craftsmanship for distinctive character and quality.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-foreground/40" />
                  Designed to be worn every day — and remembered for a lifetime.
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  Read our story
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent/10"
                >
                  Explore collections
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

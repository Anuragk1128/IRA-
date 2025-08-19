import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const collections = [
  {
    title: "Everyday Elegance",
    description: "Timeless pieces for daily sophistication",
    image: "/minimalist-jewelry.png",
    itemCount: "24 pieces",
  },
  {
    title: "Evening Glamour",
    description: "Statement pieces for special occasions",
    image: "/placeholder-m4769.png",
    itemCount: "18 pieces",
  },
  {
    title: "Bridal Collection",
    description: "Perfect for your most precious moments",
    image: "/pearl-bridal-jewelry.png",
    itemCount: "12 pieces",
  },
]

export function FeaturedCollections() {
  return (
    <section className="py-8 sm:py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center space-y-2.5 sm:space-y-3 mb-8 sm:mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-elegant font-bold">
            Curated <span className="text-gradient">Collections</span>
          </h2>
          <p className="text-sm sm:text-[15px] md:text-base text-muted-foreground max-w-2xl mx-auto">
            Each collection is thoughtfully designed to complement your unique style and personality
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 sm:gap-3 md:gap-4 justify-items-center items-stretch max-w-5xl mx-auto">
          {collections.map((collection, index) => {
            const routeMap: Record<string, string> = {
              "Everyday Elegance": "/categories/necklaces",
              "Evening Glamour": "/categories/earrings",
              "Bridal Collection": "/categories/rings",
            }
            const href = routeMap[collection.title] || "/categories"
            return (
              <Link key={index} href={href} className="w-full max-w-[12rem] sm:max-w-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                <Card className="group h-full w-full overflow-hidden rounded-xl border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 bg-card/60 backdrop-blur">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={collection.image || "/placeholder.svg"}
                        alt={collection.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="p-2.5 sm:p-3 space-y-2 flex-1 flex flex-col">
                      <div>
                        <h3 className="text-sm md:text-base font-elegant font-semibold mb-1">{collection.title}</h3>
                        <p className="text-muted-foreground text-xs sm:text-[13px] md:text-sm mb-1.5">{collection.description}</p>
                        <p className="text-[10px] md:text-xs text-accent font-medium">{collection.itemCount}</p>
                      </div>
                      <Button asChild variant="ghost" size="sm" className="w-full h-8 group/btn justify-between mt-auto">
                        <span>
                          Explore Collection
                          <ArrowRight className="ml-2 inline-block align-middle h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

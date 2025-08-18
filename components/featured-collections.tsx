import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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
    <section className="py-14 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-3 mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-elegant font-bold">
            Curated <span className="text-gradient">Collections</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Each collection is thoughtfully designed to complement your unique style and personality
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {collections.map((collection, index) => (
            <Card
              key={index}
              className="group overflow-hidden rounded-xl border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 bg-card/60 backdrop-blur"
            >
              <CardContent className="p-0">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base md:text-lg font-elegant font-semibold mb-1.5">{collection.title}</h3>
                    <p className="text-muted-foreground text-xs md:text-sm mb-2">{collection.description}</p>
                    <p className="text-[11px] md:text-xs text-accent font-medium">{collection.itemCount}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full group/btn justify-between">
                    Explore Collection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

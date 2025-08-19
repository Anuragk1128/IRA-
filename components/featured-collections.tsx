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

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 md:gap-4 justify-items-center items-stretch max-w-5xl mx-auto">
          {collections.map((collection, index) => (
            <Card
              key={index}
              className="group h-full max-w-xs w-full overflow-hidden rounded-xl border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 bg-card/60 backdrop-blur"
            >
              <CardContent className="p-0 h-full flex flex-col">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-3 space-y-2 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-sm md:text-base font-elegant font-semibold mb-1">{collection.title}</h3>
                    <p className="text-muted-foreground text-xs md:text-sm mb-1.5">{collection.description}</p>
                    <p className="text-[10px] md:text-xs text-accent font-medium">{collection.itemCount}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full h-8 group/btn justify-between mt-auto">
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

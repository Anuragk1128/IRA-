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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-elegant font-bold">
            Curated <span className="text-gradient">Collections</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each collection is thoughtfully designed to complement your unique style and personality
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur"
            >
              <CardContent className="p-0">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-elegant font-semibold mb-2">{collection.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{collection.description}</p>
                    <p className="text-xs text-accent font-medium">{collection.itemCount}</p>
                  </div>
                  <Button variant="ghost" className="w-full group/btn justify-between">
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

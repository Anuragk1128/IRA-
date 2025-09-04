import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "https://ira-be.onrender.com/api"

type Category = {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

export async function FeaturedCollections() {
  return (
    <section className="py-8 sm:py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center space-y-2.5 sm:space-y-3 mb-8 sm:mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-elegant font-bold text-black">
            Curated <span>Collections</span>
          </h2>
          <p className="text-sm sm:text-[15px] md:text-base text-black max-w-2xl mx-auto">
            Each collection is thoughtfully designed to complement your unique style and personality
          </p>
        </div>

        {/* Full-width video tile */}
        <div className="mb-8 sm:mb-10 md:mb-14 bg-neutral-400 rounded-xl overflow-hidden ">
          <div className="relative w-full px-0 py-0">
            <div className="relative w-full aspect-video">
              <video
                src="/ira_hoe.mp4"
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls={false}
              />
            </div>
            <h3 className="mt-3 text-center text-foreground-muted text-black text-lg sm:text-xl md:text-2xl font-semibold ">Collections you'll love</h3>
            <p className="mt-2 text-center text-black text-foreground-muted text-sm sm:text-base md:text-lg">Let's take a glimpse at our featured collections before diving in!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2 sm:gap-3 md:gap-4 justify-items-center items-stretch max-w-5xl mx-auto">
          {await (async () => {
            try {
              const res = await fetch(`${BASE_URL}/categories`, { cache: 'no-store', headers: { accept: 'application/json' } })
              if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`)
              const data = await res.json()
              const list: Category[] = (data?.categories || data || []).slice(0, 3).map((c: any) => ({
                id: String(c.id || c._id || c.slug || c.name),
                name: String(c.name || c.title || ''),
                slug: String(c.slug || ''),
                description: String(c.description || ''),
                image: typeof c.image === 'string' ? c.image : (Array.isArray(c.images) ? c.images[0] : undefined),
              }))

              return list.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug || ''}`} className="w-full max-w-[14rem] sm:max-w-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                  <Card className="group h-full w-full overflow-hidden rounded-xl border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 bg-card/60 backdrop-blur">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={cat.image || "/placeholder.svg"}
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      </div>
                      <div className="p-2.5 sm:p-3 space-y-2 flex-1 flex flex-col">
                        <div>
                          <h3 className="text-sm md:text-base font-elegant font-semibold mb-1">{cat.name}</h3>
                          {cat.description && (
                            <p className="text-muted-foreground text-xs sm:text-[13px] md:text-sm mb-1.5">{cat.description}</p>
                          )}
                        </div>
                        <Button asChild variant="ghost" size="sm" className="w-full h-8 group/btn justify-between mt-auto px-2">
                          <span className="w-full flex items-center justify-between">
                            <span className="truncate">Explore Collection</span>
                            <ArrowRight className="ml-2 inline-block align-middle h-4 w-4 shrink-0 transition-transform group-hover/btn:translate-x-1 sm:group-hover/btn:translate-x-1 group-hover/btn:translate-x-0.5" />
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            } catch (e) {
              return null
            }
          })()}
        </div>
      </div>
    </section>
  )
}

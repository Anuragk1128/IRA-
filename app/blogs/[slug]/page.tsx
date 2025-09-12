import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { findBlog, getBlogs } from "@/lib/blogs"

export default function BlogReadPage({ params, searchParams }: { params: { slug: string }, searchParams: any }){
  const highlighted = findBlog(params.slug)
  const others = getBlogs().filter((b) => b.slug !== params.slug).slice(0, 6)
  if (!highlighted) {
    return (
      <div className="min-h-screen">
        <Header/>
        <main className="container mx-auto px-4 py-12">
          <p>Blog not found.</p>
        </main>
        <Footer/>
      </div>
    )
  }
  return (
    <div className="min-h-screen">
      <Header/>
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-elegant mb-3">{highlighted.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">By {highlighted.author} • {new Date(highlighted.date).toLocaleDateString()}</p>
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <Image src={highlighted.coverImage} alt={highlighted.title} fill className="object-cover" />
          </div>
          <div className="prose max-w-none text-foreground/90">
            <p>{highlighted.content}</p>
          </div>
        </article>

        <section className="max-w-5xl mx-auto mt-12">
          <h2 className="text-xl font-medium mb-4">More from IRA</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((post) => (
              <Link key={post.slug} href={`/blogs/${post.slug}`} className="block">
                <div className="rounded-lg overflow-hidden border hover:shadow-md transition-shadow">
                  <div className="relative aspect-video">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium line-clamp-2 mb-1">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}


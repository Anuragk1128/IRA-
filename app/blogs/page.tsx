import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { getBlogs } from "@/lib/blogs"

export default function Blog(){
    const posts = getBlogs(10)
    return(
        <div className="min-h-screen">
            <Header/>
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-elegant text-center mb-8">Our Blogs</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/blogs/${post.slug}`}>
                            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-video relative">
                                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                                </div>
                                <div className="p-4">
                                    <h2 className="font-semibold text-lg mb-1">{post.title}</h2>
                                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer/>
        </div>
    )
}
import Link from "next/link"
import Image from "next/image"
import { Card } from "./ui/card"
import { getBlogs } from "@/lib/blogs"

export default function Blogs(){
    const posts = getBlogs(4)
    return(
        <section className="py-8">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-2xl font-elegant mb-6">Our Blogs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/blogs?highlight=${encodeURIComponent(post.slug)}`}>
                            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-video relative">
                                    <Image 
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-medium line-clamp-2 mb-1">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
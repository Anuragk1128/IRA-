import Image from "next/image"
import Link from "next/link"

export function Festive() {
    return (
        <section className="w-full">
            <Link href="/products" className="block">
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden">
                    <Image 
                        src="/festive2.jpeg" 
                        alt="Festive Collection" 
                        fill
                        className="object-cover w-full h-full"
                        sizes="100vw"
                        priority
                    />
                </div>
                        </Link> 
        </section>
    )
}
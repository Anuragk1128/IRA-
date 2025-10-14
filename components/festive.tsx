import Image from "next/image"
import Link from "next/link"

export function Festive() {
    return (
        <section className="w-full">
            <Link href="/products" className="block">
                <div className="relative w-full h-[400px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]">
                    <Image 
                        src="https://res.cloudinary.com/dvbx2tqcg/image/upload/v1760429798/Diwali_Banner_IRA_-_1920_1000_snqwhb.webp" 
                        alt="Festive Collection" 
                        fill
                        className="object-fill w-full h-full"
                        sizes="100vw"
                        priority
                    />
                </div>
            </Link> 
        </section>
    )
}
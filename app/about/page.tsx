import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Award, Truck, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Crafting Beauty,
                <span className="text-rose-600"> Defining Elegance</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                For over a decade, we've been creating exquisite artificial jewelry that captures the essence of luxury
                without compromise. Our passion for craftsmanship and attention to detail ensures every piece tells a
                unique story.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-600">10+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-600">50K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder-0jco0.png"
                alt="Jewelry crafting process"
                width={500}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in creating jewelry that empowers, inspires, and celebrates the unique beauty of every
              individual.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Passion</h3>
                <p className="text-gray-600">
                  Every piece is crafted with love and dedication to bring joy to our customers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality</h3>
                <p className="text-gray-600">
                  We use only the finest materials and techniques to ensure lasting beauty.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Service</h3>
                <p className="text-gray-600">Fast, reliable delivery and exceptional customer support every time.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trust</h3>
                <p className="text-gray-600">
                  Your satisfaction is guaranteed with our secure shopping and return policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 bg-rose-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-6">
              Founded in 2014 by jewelry enthusiast Maria Rodriguez, our company began as a small studio with a simple
              mission: to make beautiful, high-quality jewelry accessible to everyone. What started as a passion project
              has grown into a trusted brand serving customers worldwide.
            </p>
            <p className="mb-6">
              We believe that jewelry should be an expression of personal style, not a luxury reserved for special
              occasions. That's why we've dedicated ourselves to creating pieces that combine the elegance of fine
              jewelry with the accessibility of artificial materials.
            </p>
            <p>
              Today, our team of skilled artisans continues to push the boundaries of design and craftsmanship, ensuring
              that every piece we create meets our exacting standards for beauty, quality, and value.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

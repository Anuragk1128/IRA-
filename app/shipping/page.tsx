import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, Shield, RefreshCw } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Header/>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping & Replacements</h1>
          <p className="text-lg text-gray-600">Everything you need to know about our shipping and replacement policies.</p>
        </div>

        {/* Shipping Options */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-600" />
                Shipping Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Standard Shipping</h3>
                  <span className="text-rose-600 font-medium">FREE on orders </span>
                </div>
                <p className="text-gray-600 text-sm">3-5 business days • </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center ">
                  <h2 className="font-semibold">Our Services</h2>
                </div>
                <p className="text-gray-600 text-sm">We are partenered with Shipyaari to provide you with the best shipping experience.</p>
              </div>

              

              

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-rose-600" />
                Order Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Processing Time</h3>
                <p className="text-gray-600 text-sm">
                  Orders are typically processed within 1-2 business days. You'll receive a confirmation email with
                  tracking information once your order ships.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Modifications</h3>
                <p className="text-gray-600 text-sm">
                  Changes can be made within 2 hours of placing your order. After this time, orders enter our
                  fulfillment process and cannot be modified.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tracking Your Order</h3>
                <p className="text-gray-600 text-sm">
                  Track your package using the tracking number provided in your shipping confirmation email. Updates are
                  available in real-time through our shipping partners.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Returns Policy */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-rose-600" />
                Replacements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">7-Day Replacement Policy</h3>
                <p className="text-gray-600 text-sm">
                  Replace unworn items in original packaging within 7 days of delivery. Items must
                  include all original tags and packaging.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Replacement Process</h3>
                <ol className="text-gray-600 text-sm space-y-1 list-decimal list-inside">
                  <li>Log into your account and select "Replace Item"</li>
                  <li>Print the prepaid replacement shipping label</li>
                  <li>Package items securely with original packaging</li>
                  <li>Drop off at any authorized shipping location</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Replacement Timeline</h3>
                <p className="text-gray-600 text-sm">
                  Replaced Items are processed within 5-7 business days after we receive your request. The replacement will appear on
                  your orders page.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-600" />
                Quality Guarantee
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Defective Items</h3>
                <p className="text-gray-600 text-sm">
                  If you receive a defective item, we'll provide a prepaid replacement label and  replacement your item
                  at no cost to you.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Wrong Item Received</h3>
                <p className="text-gray-600 text-sm">
                  If you receive the wrong item, contact us immediately. We'll arrange for return pickup and send the
                  correct item at no additional charge.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Damaged in Transit</h3>
                <p className="text-gray-600 text-sm">
                  Items damaged during shipping are covered by our guarantee. Take photos of the damage and contact us
                  within 48 hours of delivery.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <p className="text-gray-600 text-sm">
                  Questions about returns or exchanges? Contact our support team at admin@houseofevolve.in or call +91
                  (934) 133-0223.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

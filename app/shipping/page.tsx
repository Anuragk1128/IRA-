import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, Shield, RefreshCw } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping & Returns</h1>
          <p className="text-lg text-gray-600">Everything you need to know about our shipping and return policies.</p>
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
                  <span className="text-rose-600 font-medium">FREE on orders $75+</span>
                </div>
                <p className="text-gray-600 text-sm">3-5 business days • $5.99 for orders under $75</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Express Shipping</h3>
                  <span className="text-gray-900 font-medium">$12.99</span>
                </div>
                <p className="text-gray-600 text-sm">1-2 business days • Available for most locations</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Overnight Shipping</h3>
                  <span className="text-gray-900 font-medium">$24.99</span>
                </div>
                <p className="text-gray-600 text-sm">Next business day • Order by 2 PM EST</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">International Shipping</h3>
                  <span className="text-gray-900 font-medium">$15.99+</span>
                </div>
                <p className="text-gray-600 text-sm">7-21 business days • Customs fees may apply</p>
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
                Returns & Exchanges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">30-Day Return Policy</h3>
                <p className="text-gray-600 text-sm">
                  Return unworn items in original packaging within 30 days of delivery for a full refund. Items must
                  include all original tags and packaging.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Return Process</h3>
                <ol className="text-gray-600 text-sm space-y-1 list-decimal list-inside">
                  <li>Log into your account and select "Return Item"</li>
                  <li>Print the prepaid return shipping label</li>
                  <li>Package items securely with original packaging</li>
                  <li>Drop off at any authorized shipping location</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Refund Timeline</h3>
                <p className="text-gray-600 text-sm">
                  Refunds are processed within 5-7 business days after we receive your return. The refund will appear on
                  your original payment method.
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
                  If you receive a defective item, we'll provide a prepaid return label and full refund or replacement
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
                  Questions about returns or exchanges? Contact our support team at support@jewelrystore.com or call +1
                  (555) 123-4567.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

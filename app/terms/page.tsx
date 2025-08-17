import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: August 17, 2025</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2>2. Products and Services</h2>
            <p>
              All products displayed on our website are artificial jewelry items. We strive to display accurate colors
              and images of our products, but we cannot guarantee that your device's display will accurately reflect the
              actual product colors.
            </p>

            <h2>3. Pricing and Payment</h2>
            <p>
              All prices are listed in INR (Indian Rupees) and are subject to change without notice. We accept major credit cards,
              UPI, Net Banking, and other payment methods as displayed during checkout. Payment is due at the time of purchase.
            </p>

            <h2>4. Shipping and Delivery</h2>
            <p>
              We ship to addresses across India. Shipping costs and delivery times vary by location and shipping method selected.
              Standard delivery typically takes 3-7 business days. Risk of loss passes to you upon delivery to the carrier.
            </p>

            <h2>5. Returns and Exchanges</h2>
            <p>
              We accept returns within 7 days of delivery for unworn items in original packaging with all tags attached.
              Return shipping costs are the responsibility of the customer unless the item was defective or incorrectly shipped.
            </p>

            <h2>6. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
              website, to understand our practices.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall our company be liable for any direct, indirect, incidental, special, or consequential
              damages arising out of or in connection with your use of this website or products purchased.
            </p>

            <h2>8. Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at admin@houseofevolve.in or
              call +91 9341330223. Our registered office is located at:
              <br /><br />
              IRA Jewelry<br />
              123 Jewelry Street,<br />
              Mumbai - 400001,<br />
              Maharashtra, India
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

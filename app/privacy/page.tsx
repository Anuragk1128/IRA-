import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 15, 2024</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you:</p>
            <ul>
              <li>Create an account or make a purchase</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us for customer support</li>
              <li>Participate in surveys or promotions</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your account or transactions</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your
              consent, except as described in this policy. We may share information with:
            </p>
            <ul>
              <li>Service providers who assist in our operations</li>
              <li>Payment processors for transaction processing</li>
              <li>Shipping companies for order fulfillment</li>
              <li>Legal authorities when required by law</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method of transmission over the internet is
              100% secure.
            </p>

            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and
              personalize content. You can control cookie settings through your browser preferences.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and update your personal information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@jewelrystore.com or call +1
              (555) 123-4567.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

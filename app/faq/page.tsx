"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqData = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping takes 3-5 business days within the US. Express shipping (1-2 days) and international shipping are also available. You'll receive tracking information once your order ships.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes! We ship to most countries worldwide. International shipping times vary by location (7-21 business days). Additional customs fees may apply depending on your country's regulations.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "Orders can be modified or cancelled within 2 hours of placement. After this time, orders enter our fulfillment process and cannot be changed. Contact us immediately if you need to make changes.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for unworn items in original packaging with tags attached. Items must be in sellable condition. Return shipping costs are covered by the customer unless the item was defective.",
      },
      {
        question: "How do I return an item?",
        answer:
          "Log into your account, go to Order History, and select 'Return Item'. Print the prepaid return label and ship the item back to us. Refunds are processed within 5-7 business days after we receive your return.",
      },
      {
        question: "Can I exchange an item for a different size or color?",
        answer:
          "Yes! Exchanges are treated as returns + new orders. Return the original item and place a new order for your preferred size/color. This ensures you get the item you want as quickly as possible.",
      },
    ],
  },
  {
    category: "Product Information",
    questions: [
      {
        question: "Are your products hypoallergenic?",
        answer:
          "Most of our jewelry is nickel-free and suitable for sensitive skin. Products containing nickel or other potential allergens are clearly marked in the product description. Check individual product details for specific material information.",
      },
      {
        question: "How do I determine my ring size?",
        answer:
          "Use our ring size guide in the Size Guide section. You can measure an existing ring or use our printable ring sizer. When in doubt, size up slightly as rings can be resized down more easily than up.",
      },
      {
        question: "How should I care for my artificial jewelry?",
        answer:
          "Store pieces separately to prevent scratching, avoid exposure to water, perfumes, and lotions. Clean gently with a soft cloth. Avoid sleeping or exercising while wearing jewelry to extend its lifespan.",
      },
    ],
  },
  {
    category: "Account & Payment",
    questions: [
      {
        question: "Do I need an account to make a purchase?",
        answer:
          "No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, manage addresses, and access exclusive member benefits.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secure and encrypted.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes! We use industry-standard SSL encryption and never store your complete credit card information. All payments are processed through secure, PCI-compliant payment processors.",
      },
    ],
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">Find answers to common questions about our products and services.</p>
        </div>

        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const itemId = `${categoryIndex}-${questionIndex}`
                  const isOpen = openItems.includes(itemId)

                  return (
                    <Card key={questionIndex} className="overflow-hidden">
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      {isOpen && (
                        <CardContent className="pt-0 pb-6 px-6">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 bg-rose-50 border-rose-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our customer service team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="mailto:support@jewelrystore.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
              >
                Email Support
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

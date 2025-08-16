"use client"

import { useState } from "react"
import { CreditCard, Smartphone, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCheckout } from "@/contexts/checkout-context"
import type { PaymentMethod } from "@/types/order"

export function PaymentStep() {
  const { setPaymentMethod, setStep } = useCheckout()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod["type"]>("credit_card")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  })

  const handleCardDataChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContinue = () => {
    const paymentMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: selectedMethod,
      isDefault: false,
      ...(selectedMethod === "credit_card" && {
        cardNumber: `**** **** **** ${cardData.cardNumber.slice(-4)}`,
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        cardholderName: cardData.cardholderName,
      }),
    }

    setPaymentMethod(paymentMethod)
    setStep("review")
  }

  const isFormValid = () => {
    if (selectedMethod === "credit_card") {
      return (
        cardData.cardNumber.length >= 16 &&
        cardData.expiryMonth &&
        cardData.expiryYear &&
        cardData.cvv.length >= 3 &&
        cardData.cardholderName.trim()
      )
    }
    return true
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value) => setSelectedMethod(value as PaymentMethod["type"])}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  Credit or Debit Card
                </Label>
              </div>

              {selectedMethod === "credit_card" && (
                <div className="ml-7 space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={(e) => handleCardDataChange("cardNumber", e.target.value.replace(/\s/g, ""))}
                      maxLength={16}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={cardData.cardholderName}
                      onChange={(e) => handleCardDataChange("cardholderName", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryMonth">Month *</Label>
                      <Select
                        value={cardData.expiryMonth}
                        onValueChange={(value) => handleCardDataChange("expiryMonth", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0")
                            return (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryYear">Year *</Label>
                      <Select
                        value={cardData.expiryYear}
                        onValueChange={(value) => handleCardDataChange("expiryYear", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (new Date().getFullYear() + i).toString()
                            return (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => handleCardDataChange("cvv", e.target.value)}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                <RadioGroupItem value="paypal" id="paypal" disabled />
                <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  PayPal
                </Label>
                <span className="text-xs text-muted-foreground ml-auto">Coming Soon</span>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                <RadioGroupItem value="apple_pay" id="apple_pay" disabled />
                <Label htmlFor="apple_pay" className="flex items-center gap-2 cursor-pointer">
                  <Smartphone className="h-4 w-4" />
                  Apple Pay
                </Label>
                <span className="text-xs text-muted-foreground ml-auto">Coming Soon</span>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                <RadioGroupItem value="google_pay" id="google_pay" disabled />
                <Label htmlFor="google_pay" className="flex items-center gap-2 cursor-pointer">
                  <Smartphone className="h-4 w-4" />
                  Google Pay
                </Label>
                <span className="text-xs text-muted-foreground ml-auto">Coming Soon</span>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("shipping")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shipping
        </Button>
        <Button onClick={handleContinue} disabled={!isFormValid()}>
          Review Order
        </Button>
      </div>
    </div>
  )
}

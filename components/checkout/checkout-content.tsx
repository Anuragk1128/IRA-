"use client"

import { CheckoutSteps } from "./checkout-steps"
import { ShippingStep } from "./shipping-step"
import { PaymentStep } from "./payment-step"
import { ReviewStep } from "./review-step"
import { CompleteStep } from "./complete-step"
import { useCheckout } from "@/contexts/checkout-context"

export function CheckoutContent() {
  const { checkoutState } = useCheckout()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-elegant text-foreground mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase securely</p>
      </div>

      <CheckoutSteps currentStep={checkoutState.step} />

      <div className="mt-8">
        {checkoutState.step === "shipping" && <ShippingStep />}
        {checkoutState.step === "payment" && <PaymentStep />}
        {checkoutState.step === "review" && <ReviewStep />}
        {checkoutState.step === "complete" && <CompleteStep />}
      </div>
    </div>
  )
}

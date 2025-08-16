"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { CheckoutState, Address, PaymentMethod } from "@/types/order"

interface CheckoutContextType {
  checkoutState: CheckoutState
  setStep: (step: CheckoutState["step"]) => void
  setShippingAddress: (address: Address) => void
  setBillingAddress: (address: Address) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setSameAsBilling: (same: boolean) => void
  resetCheckout: () => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

const initialState: CheckoutState = {
  step: "shipping",
  sameAsBilling: true,
}

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>(initialState)

  const setStep = (step: CheckoutState["step"]) => {
    setCheckoutState((prev) => ({ ...prev, step }))
  }

  const setShippingAddress = (address: Address) => {
    setCheckoutState((prev) => ({ ...prev, shippingAddress: address }))
  }

  const setBillingAddress = (address: Address) => {
    setCheckoutState((prev) => ({ ...prev, billingAddress: address }))
  }

  const setPaymentMethod = (method: PaymentMethod) => {
    setCheckoutState((prev) => ({ ...prev, paymentMethod: method }))
  }

  const setSameAsBilling = (same: boolean) => {
    setCheckoutState((prev) => ({ ...prev, sameAsBilling: same }))
  }

  const resetCheckout = () => {
    setCheckoutState(initialState)
  }

  return (
    <CheckoutContext.Provider
      value={{
        checkoutState,
        setStep,
        setShippingAddress,
        setBillingAddress,
        setPaymentMethod,
        setSameAsBilling,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }
  return context
}

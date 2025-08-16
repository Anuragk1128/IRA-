import { Check } from "lucide-react"
import type { CheckoutState } from "@/types/order"

interface CheckoutStepsProps {
  currentStep: CheckoutState["step"]
}

const steps = [
  { id: "shipping", name: "Shipping", description: "Address details" },
  { id: "payment", name: "Payment", description: "Payment method" },
  { id: "review", name: "Review", description: "Order summary" },
  { id: "complete", name: "Complete", description: "Order confirmation" },
] as const

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex
        const isCurrent = index === currentStepIndex
        const isUpcoming = index > currentStepIndex

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary text-primary"
                      : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

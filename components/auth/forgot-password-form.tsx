"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Mail, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { sendPasswordResetOTP, resetPassword } from "@/lib/auth"

type ForgotPasswordFormProps = {
  onBack?: () => void
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email" | "otp" | "new-password">("email")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sendPasswordResetOTP(email)
      toast({
        title: "OTP Sent",
        description: "Password reset OTP has been sent to your email.",
      })
      setStep("otp")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) {
      toast({
        title: "Error",
        description: "Please enter the OTP sent to your email.",
        variant: "destructive",
      })
      return
    }
    setStep("new-password")
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await resetPassword({ email, otp, newPassword })
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully. You can now sign in with your new password.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-elegant text-foreground">Forgot Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email address and we'll send you an OTP to reset your password
        </p>
      </div>

      <form onSubmit={handleSendOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send OTP
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </button>
      </div>
    </div>
  )

  const renderOTPStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-elegant text-foreground">Enter OTP</h1>
        <p className="text-muted-foreground mt-2">
          We've sent a 6-digit OTP to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">OTP Code</Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="pl-10 text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={otp.length !== 6}>
          Continue
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setStep("email")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Didn't receive OTP? Try again
        </button>
      </div>
    </div>
  )

  const renderNewPasswordStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-elegant text-foreground">Set New Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your new password for <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reset Password
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setStep("otp")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back to OTP
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {step === "email" && renderEmailStep()}
      {step === "otp" && renderOTPStep()}
      {step === "new-password" && renderNewPasswordStep()}
    </div>
  )
}

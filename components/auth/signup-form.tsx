"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { sendRegistrationOTP, signUpWithOTP, setAuthToken } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import GoogleLoginWrapper from "./google-login"

type SignupFormProps = {
  redirectToAccount?: boolean
  onSwitchToLogin?: () => void
}

export function SignupForm({ redirectToAccount = false, onSwitchToLogin }: SignupFormProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const { signIn: authSignIn } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await sendRegistrationOTP(formData.email)
      setOtpSent(true)
      setStep(2)
      toast({
        title: "OTP sent!",
        description: "Please check your email for the verification code.",
      })
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true)

    try {
      await sendRegistrationOTP(formData.email)
      toast({
        title: "OTP resent!",
        description: "A new verification code has been sent to your email.",
      })
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Complete Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      })
      return
    }

    if (!formData.password) {
      toast({
        title: "Password required",
        description: "Please enter a password.",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    if (!formData.otp) {
      toast({
        title: "OTP required",
        description: "Please enter the verification code sent to your email.",
        variant: "destructive",
      })
      return
    }

    if (formData.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "OTP must be 6 digits.",
        variant: "destructive",
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: "Terms required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { user, token } = await signUpWithOTP({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        otp: formData.otp,
      })
      
      setAuthToken(token)
      authSignIn(user, token)
      
      toast({
        title: "Account created!",
        description: "Welcome to IRA by House of Evolve. Your account has been created successfully.",
      })
      
      // Redirect to home page as per requirement
      router.push("/")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-elegant text-foreground">Create Account</h1>
        <p className="text-muted-foreground mt-2">Join us and discover beautiful jewellery</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'}`}>
            {step > 1 ? <Check className="h-4 w-4" /> : '1'}
          </div>
          <span className={`ml-2 text-sm ${step === 1 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
            Email
          </span>
        </div>
        <div className={`h-px w-12 ${step === 2 ? 'bg-primary' : 'bg-border'}`} />
        <div className="flex items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            2
          </div>
          <span className={`ml-2 text-sm ${step === 2 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
            Complete
          </span>
        </div>
      </div>

      {/* Step 1: Email */}
      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              We'll send a verification code to this email
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Verification Code
          </Button>
        </form>
      )}

      {/* Step 2: Complete Registration */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-readonly">Email Address</Label>
            <Input
              id="email-readonly"
              name="email"
              type="email"
              value={formData.email}
              readOnly
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum 6 characters
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="otp">Verification Code</Label>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={handleResendOTP}
                disabled={isLoading}
              >
                Resend Code
              </Button>
            </div>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={formData.otp}
              onChange={handleChange}
              maxLength={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to {formData.email}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              disabled={isLoading}
              className="w-1/3"
            >
              Back
            </Button>
            <Button type="submit" className="w-2/3" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </div>
        </form>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <GoogleLoginWrapper />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        {onSwitchToLogin ? (
          <button type="button" className="text-primary hover:underline" onClick={onSwitchToLogin}>
            Sign in
          </button>
        ) : (
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        )}
      </p>
    </div>
  )
}

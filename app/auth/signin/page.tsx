"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import LoadingScreen from "@/components/loading-screen"
import { toast } from "sonner"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/account'
  const { login, loginWithGoogle, user, loading } = useAuth()
  
  // Move ALL hooks to the top, before any conditionals
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    if (user && !loading) {
      router.push("/account")
    }
  }, [user, loading, router])
  
  // Conditionals should come AFTER all hooks
  if (loading) {
    return <LoadingScreen />
  }
  
  if (user) {
    return null;
  }

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast.success("Signed in successfully!")
      router.push(callbackUrl)
    } catch (error: unknown) {
      console.error("Signin error:", error)
      
      // Handle specific Firebase auth errors
      const errorMessage = error instanceof Error ? error.message : "Sign in failed. Please try again."
      
      if (errorMessage.includes('auth/invalid-credential')) {
        toast.error("Invalid email or password")
      } else if (errorMessage.includes('auth/user-not-found')) {
        toast.error("No account found with this email")
      } else if (errorMessage.includes('auth/wrong-password')) {
        toast.error("Incorrect password")
      } else if (errorMessage.includes('auth/too-many-requests')) {
        toast.error("Too many failed attempts. Please try again later.")
      } else {
        toast.error("Sign in failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await loginWithGoogle()
      toast.success("Signed in successfully!")
      router.push(callbackUrl)
    } catch (error: unknown) {
      console.error("Google sign-in error:", error)
      
      const errorMessage = error instanceof Error ? error.message : "Google sign-in failed. Please try again."
      
      if (errorMessage.includes('auth/popup-closed-by-user')) {
        toast.error("Sign-in cancelled")
      } else if (errorMessage.includes('auth/popup-blocked')) {
        toast.error("Popup blocked! Please allow popups for this site.")
      } else if (errorMessage.includes('auth/unauthorized-domain')) {
        toast.error("This domain is not authorized for Google sign-in.")
      } else {
        toast.error("Google sign-in failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #16a34a 0%, #22c55e 25%, #65a30d 50%, #84cc16 75%, #eab308 100%)",
      }}
    >
      {/* Curved background shapes */}
      <div className="absolute inset-0">
        <div
          className="absolute bottom-0 left-0 w-full h-3/4"
          style={{
            background: "linear-gradient(135deg, #16a34a 0%, #22c55e 25%, #65a30d 50%, #84cc16 75%, #eab308 100%)",
            clipPath: "ellipse(150% 100% at 50% 100%)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image src="/images/logo.jpg" alt="My Mom&rsquo;s Recipe" width={120} height={60} className="mx-auto mb-6" />
            <h1 className="text-2xl font-semibold text-gray-800">Sign In</h1>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSignin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-0 border-b-2 border-gray-200 rounded-none px-0 py-2 focus:border-green-600 focus:ring-0 bg-transparent"
                required
                disabled={isLoading || loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-0 border-b-2 border-gray-200 rounded-none px-0 py-2 focus:border-green-600 focus:ring-0 bg-transparent"
                required
                disabled={isLoading || loading}
              />
            </div>

            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <div className="flex space-x-3">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
                disabled={isLoading || loading}
              >
                {(isLoading || loading) ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium"
                disabled={isLoading || loading}
              >
                Cancel
              </Button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">Not Registered? </span>
              <Link href="/auth/signup" className="text-sm text-blue-600 hover:underline font-medium">
                Sign Up
              </Link>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with social account</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
              disabled={isLoading || loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in With Google</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
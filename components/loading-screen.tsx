"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingText, setLoadingText] = useState("Preparing your experience...")

  const loadingMessages = [
    "Preparing your experience...",
    "Loading fresh ingredients...",
    "Mixing traditional flavors...",
    "Almost ready to serve...",
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingMessages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingMessages.length
        return loadingMessages[nextIndex]
      })
    }, 750)

    return () => {
      clearTimeout(timer)
      clearInterval(messageInterval)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image src="/images/logo.jpg" alt="My Mom's Recipe" width={200} height={100} className="mx-auto" />
        </div>

        {/* Animated Loading Dots */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* Pulsing Ring Animation */}
        <div className="relative mb-8">
          <div className="w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-green-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-yellow-300 border-b-transparent animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-green-700 transition-all duration-300">{loadingText}</p>
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping [animation-delay:0s] opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping [animation-delay:1s] opacity-40"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-green-300 rounded-full animate-ping [animation-delay:2s] opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-ping [animation-delay:0.5s] opacity-30"></div>
        </div>
      </div>
    </div>
  )
}

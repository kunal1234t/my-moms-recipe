// components/header.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, X} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import Image from "next/image"

export default function Header() {
  const pathname = usePathname()
  const { cart } = useCart()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const cartItemsCount = cart.reduce((total, item) => total + (item.quantity || 1), 0)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      setIsMenuOpen(false)
    } catch {
      toast.error("Failed to logout")
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-green-600 to-yellow-600 px-4 py-2 text-center text-sm text-white">
        <p>🎉 Free shipping on orders above ₹500! Use code: FREESHIP</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/logo.jpg" alt="My Mom&rsquo;s Recipe" width={120} height={60} className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium transition-colors ${
                isActive("/") ? "text-green-600" : "text-gray-700 hover:text-green-600"
              }`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`font-medium transition-colors ${
                isActive("/products") ? "text-green-600" : "text-gray-700 hover:text-green-600"
              }`}
            >
              Products
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition-colors ${
                isActive("/about") ? "text-green-600" : "text-gray-700 hover:text-green-600"
              }`}
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium transition-colors ${
                isActive("/contact") ? "text-green-600" : "text-gray-700 hover:text-green-600"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for pickles, chutneys..."
                className="pl-10 border-gray-300 focus:border-green-500"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Link href={user ? "/account" : "/auth/signin"}>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-green-600 p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search products..." className="pl-10 border-gray-300" />
              </div>
            </div>
            <nav className="space-y-4">
              <Link 
                href="/" 
                className="block font-medium transition-colors hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="block font-medium transition-colors hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/about" 
                className="block font-medium transition-colors hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="block font-medium transition-colors hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href={user ? "/account" : "/auth/signin"}
                className="block font-medium transition-colors hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {user ? "My Account" : "Sign In"}
              </Link>
              {user && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left font-medium text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
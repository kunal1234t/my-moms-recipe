"use client"
import { useSession } from "next-auth/react";

import { SessionProvider } from "next-auth/react";
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, Search, ShoppingCart, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import LoadingScreen from "./loading-screen";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount] = useState(3)
  const { data: session,status } = useSession();
   if (status === "loading") {
    return <LoadingScreen />
  }
  return (
    <SessionProvider>
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-green-600 to-yellow-600 px-4 py-2 text-center text-sm text-white">
        <p>🎉 Free shipping on orders above ₹500! Use code: FREESHIP</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/logo.jpg" alt="My Mom's Recipe" width={120} height={60} className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 font-medium">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-green-600 font-medium">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600 font-medium">
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
    <Link href={status === "authenticated" ? "/account" : "/auth/signin"}>
      <Button variant="ghost" size="icon" className="hidden md:flex">
        <User className="h-5 w-5" />
      </Button>
    </Link>

    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-green-600 p-0 text-xs">
            {cartCount}
          </Badge>
        )}
      </Button>
    </Link>

    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
              <Link href="/" className="block text-gray-700 hover:text-green-600 font-medium">
                Home
              </Link>
              <Link href="/products" className="block text-gray-700 hover:text-green-600 font-medium">
                Products
              </Link>
              <Link href="/about" className="block text-gray-700 hover:text-green-600 font-medium">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-700 hover:text-green-600 font-medium">
                Contact
              </Link>
              <Link
  href={session ? "/account" : "/auth/signin"}
  className="block text-gray-700 hover:text-green-600 font-medium"
>
  {session ? "My Account" : "Sign In"}
</Link>

            </nav>
          </div>
        )}
      </div>
    </header>
    </SessionProvider>
  )
}

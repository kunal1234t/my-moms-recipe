// app/cart/page.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function CartPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [isCheckout, setIsCheckout] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const originalTotal = cart.reduce((sum, item) => sum + (item.originalPrice || item.price) * (item.quantity || 1), 0)
  const savings = originalTotal - subtotal
  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal + shipping

  const handleProceedToCheckout = () => {
    if (!user) {
      router.push("/auth/signin?callbackUrl=/cart")
      return
    }
    setIsCheckout(true)
    // You can pre-fill phone if available in user data
    // You might want to fetch user data from Firestore here
  }

  const handlePlaceOrder = async () => {
  if (!deliveryAddress.trim()) {
    toast.error("Please enter a delivery address")
    return
  }
  if (!userPhone.trim()) {
    toast.error("Please enter your phone number")
    return
  }

  setIsProcessing(true)

  try {
    // Prepare order data for Firebase
    const orderData = {
      user: {
        uid: user?.uid,
        email: user?.email,
        name: user?.displayName || "Customer",
        phone: userPhone
      },
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
        weight: item.weight
      })),
      totalAmount: total,
      subtotal: subtotal,
      shipping: shipping,
      shippingAddress: deliveryAddress,
      paymentMethod: "cash",
      status: "pending",
      createdAt: new Date().toISOString()
    }

    // Save order to Firebase
    const orderResponse = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      throw new Error(errorData.error || 'Failed to create order')
    }

    const { orderId } = await orderResponse.json()

    // Send WhatsApp notification to ADMIN (server-side)
    const whatsappResponse = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        customerName: user?.displayName || 'Customer',
        customerPhone: userPhone,
        customerEmail: user?.email || 'Not provided',
        items: cart,
        subtotal,
        shipping,
        total,
        deliveryAddress
      })
    })

    if (!whatsappResponse.ok) {
      console.warn("Failed to send WhatsApp notification, but order was created")
      // Don't throw error here - order was created successfully
    }

    // Clear cart and redirect
    clearCart()
    toast.success("Order placed successfully! We'll contact you shortly.")
    router.push('/account?tab=orders')

  } catch (error: unknown) {
    console.error("Order failed:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to place order. Please try again."
    toast.error(errorMessage)
  } finally {
    setIsProcessing(false)
  }
}

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (cart.length === 0 && !isCheckout) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Browse our delicious pickles to get started!
            </p>
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700 px-6 py-3">
                View Products
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (isCheckout) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <Button 
              variant="ghost" 
              onClick={() => setIsCheckout(false)}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Summary</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <Input
                        value={user?.displayName || ""}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Number *</label>
                      <Input
                        placeholder="Phone number for delivery updates"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Delivery Address *</label>
                      <Input
                        placeholder="Full address with landmarks, city, pincode"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-b-0">
                        <div className="flex items-center space-x-4">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-600">
                              {item.weight || item.quantity || 1} × ₹{item.price}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium">
                          ₹{item.price * (item.quantity || 1)}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      {savings > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>You Saved</span>
                          <span>-₹{savings}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span>₹{total}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-gray-600 mb-4">
                        We&rsquo;ll contact you on WhatsApp to confirm your order and arrange payment (Cash on Delivery or digital payment).
                      </p>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Confirm Order via WhatsApp'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{item.weight}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            disabled={(item.quantity || 1) <= 1}
                            className="px-2"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 font-medium w-8 text-center">
                            {item.quantity || 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="px-2"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>You Save</span>
                        <span>-₹{savings}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-sm text-green-600 text-center py-1 bg-green-50 rounded">
                        Add ₹{500 - subtotal} more for FREE delivery!
                      </p>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium">Coupon Code</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" disabled={!couponCode.trim()}>
                        Apply
                      </Button>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 mt-4 h-12 text-lg"
                    onClick={handleProceedToCheckout}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Proceed to Checkout'}
                  </Button>

                  <Link href="/products">
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 h-12 text-lg border-gray-300"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
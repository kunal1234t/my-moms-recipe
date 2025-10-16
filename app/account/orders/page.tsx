"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Package, Calendar, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import LoadingScreen from "@/components/loading-screen"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import Image from "next/image"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  weight?: string
}

interface Order {
  id: string
  user: {
    uid: string
    email: string
    name: string
    phone: string
  }
  items: OrderItem[]
  totalAmount: number
  subtotal: number
  shipping: number
  shippingAddress: string
  paymentMethod: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt?: string
}

// Define Firebase error type
interface FirebaseError extends Error {
  code?: string
}

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>('')

  // Wrap fetchOrders in useCallback to make it stable
  const fetchOrders = useCallback(async () => {
    if (!user) {
      setDebugInfo('No user found')
      return
    }
    
    try {
      setDebugInfo(`Starting fetch for user: ${user.uid}`)
      
      const ordersRef = collection(db, 'orders')
      const q = query(
        ordersRef, 
        where('user.uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      
      setDebugInfo('Query created, fetching documents...')
      const querySnapshot = await getDocs(q)
      setDebugInfo(`Found ${querySnapshot.size} documents`)
      
      const ordersData: Order[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log('Order data:', data)
        ordersData.push({
          id: doc.id,
          ...data
        } as Order)
      })
      
      setOrders(ordersData)
      setDebugInfo(`Successfully loaded ${ordersData.length} orders`)
      toast.success(`Loaded ${ordersData.length} orders`)
    } catch (error: unknown) {
      console.error("Error fetching orders:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      const errorCode = (error as FirebaseError)?.code || "Unknown code"
      setDebugInfo(`Error: ${errorMessage} - Code: ${errorCode}`)
      
      // If still getting index error, fall back to client-side sorting
      if (errorCode === 'failed-precondition') {
        toast.info("Index still building, using fallback method")
        // Fallback: fetch without orderBy and sort client-side
        const ordersRef = collection(db, 'orders')
        const fallbackQuery = query(ordersRef, where('user.uid', '==', user.uid))
        const fallbackSnapshot = await getDocs(fallbackQuery)
        
        const fallbackOrders: Order[] = []
        fallbackSnapshot.forEach((doc) => {
          fallbackOrders.push({
            id: doc.id,
            ...doc.data()
          } as Order)
        })
        
        // Client-side sorting
        fallbackOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setOrders(fallbackOrders)
        setDebugInfo(`Loaded ${fallbackOrders.length} orders with fallback`)
      } else {
        toast.error("Failed to load orders")
      }
    } finally {
      setIsLoading(false)
    }
  }, [user]) // Add user as dependency

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
      return
    }
    
    if (user) {
      fetchOrders()
    }
  }, [user, loading, router, fetchOrders]) // Add fetchOrders to dependencies

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800"
      case 'confirmed':
        return "bg-blue-100 text-blue-800"
      case 'shipped':
        return "bg-purple-100 text-purple-800"
      case 'delivered':
        return "bg-green-100 text-green-800"
      case 'cancelled':
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading || isLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600">View your order history and track current orders</p>
            </div>

            {/* Debug Info - Remove in production */}
            <Card className="mb-6 bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Debug Information:</h3>
                <p className="text-sm text-yellow-700 font-mono">{debugInfo}</p>
                <p className="text-sm text-yellow-600 mt-2">User UID: {user?.uid}</p>
              </CardContent>
            </Card>

            {/* Orders List */}
            <div className="space-y-6">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => router.push("/products")}
                    >
                      Browse Products
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id.slice(-8).toUpperCase()}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {item.weight && `${item.weight} • `}Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                              <p className="text-sm text-gray-600">₹{item.price} each</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium">₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shipping</span>
                              <span className="font-medium">{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                              <span>Total</span>
                              <span>₹{order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Payment Method</span>
                              <span className="font-medium capitalize">{order.paymentMethod}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
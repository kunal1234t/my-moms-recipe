"use client"
import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { User, Package, Heart, Settings, LogOut, Edit, ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import LoadingScreen from "@/components/loading-screen"
import { doc, getDoc, updateDoc, collection, query, getDocs, deleteDoc, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

interface WishlistItem {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  isNew?: boolean
  isBestseller?: boolean
  category?: string
  weight?: string
  inStock?: boolean
  addedAt: string
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

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  weight?: string
}

export default function AccountPage() {
  const { user, logout, loading } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isWishlistLoading, setIsWishlistLoading] = useState(true)
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)

  // Wrap fetchUserInfo in useCallback to make it stable
  const fetchUserInfo = useCallback(async () => {
    if (!user) return
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUserInfo({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || user.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
        })
      } else {
        // If no user document exists, create one with basic info
        setUserInfo({
          firstName: user.displayName?.split(' ')[0] || "",
          lastName: user.displayName?.split(' ')[1] || "",
          email: user.email || "",
          phone: "",
          address: "",
        })
      }
    } catch (err) {
      console.error("Error fetching user info:", err)
      toast.error("Failed to load user data")
    }
  }, [user])

  // Fetch wishlist items
  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setIsWishlistLoading(false)
      return
    }
    
    try {
      console.log("🔄 Fetching wishlist for user:", user.uid)
      const wishlistRef = collection(db, 'users', user.uid, 'wishlist')
      const q = query(wishlistRef)
      const querySnapshot = await getDocs(q)
      
      console.log("📊 Wishlist documents found:", querySnapshot.size)
      
      const items: WishlistItem[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log("📦 Wishlist item:", data)
        items.push({
          id: doc.id,
          ...data
        } as WishlistItem)
      })
      
      // Sort by added date (newest first)
      items.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      setWishlistItems(items)
      console.log("✅ Wishlist items loaded:", items.length)
    } catch (error) {
      console.error("❌ Error fetching wishlist:", error)
      toast.error("Failed to load wishlist")
    } finally {
      setIsWishlistLoading(false)
    }
  }, [user])

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (!user) {
      setIsOrdersLoading(false)
      return
    }
    
    try {
      console.log("🔄 Fetching orders for user:", user.uid)
      const ordersRef = collection(db, 'orders')
      const q = query(
        ordersRef, 
        where('user.uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      console.log("📊 Order documents found:", querySnapshot.size)
      
      const ordersData: Order[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        ordersData.push({
          id: doc.id,
          ...data
        } as Order)
      })
      
      setOrders(ordersData)
      console.log("✅ Orders loaded:", ordersData.length)
    } catch (error: unknown) {
      console.error("❌ Error fetching orders:", error)
      
      // Fallback: fetch without orderBy and sort client-side
      try {
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
        console.log("✅ Orders loaded with fallback:", fallbackOrders.length)
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError)
        toast.error("Failed to load orders")
      }
    } finally {
      setIsOrdersLoading(false)
    }
  }, [user])

  const saveUserInfo = async () => {
    if (!user) return
    
    setIsSaving(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...userInfo,
        updatedAt: new Date()
      })
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (err) {
      console.error("Error saving user info:", err)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully!")
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
      toast.error("Failed to logout")
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return
    
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'wishlist', productId))
      setWishlistItems(prev => prev.filter(item => item.id !== productId))
      toast.success("Removed from wishlist")
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove from wishlist")
    }
  }

  const addToCartFromWishlist = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: 1,
      image: item.image,
      weight: item.weight
    })
    toast.success("Added to cart!")
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

  // Get recent 2 wishlist items
  const recentWishlistItems = wishlistItems.slice(0, 2)
  
  // Get recent 2 orders
  const recentOrders = orders.slice(0, 2)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUserInfo()
      fetchWishlist()
      fetchOrders()
    }
  }, [user, fetchUserInfo, fetchWishlist, fetchOrders])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold">
                      {userInfo.firstName} {userInfo.lastName}
                    </h2>
                    <p className="text-gray-600">{userInfo.email}</p>
                  </div>

                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Link href="/account/orders">
                      <Button variant="ghost" className="w-full justify-start">
                        <Package className="h-4 w-4 mr-2" />
                        Orders ({orders.length})
                      </Button>
                    </Link>
                    <Link href="/account/wishlist">
                      <Button variant="ghost" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist ({wishlistItems.length})
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600"
                      onClick={handleLogout}
                      disabled={isSaving}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                  <TabsTrigger value="wishlist">Recent Wishlist</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Personal Information</CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(!isEditing)}
                        disabled={isSaving}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">First Name</p>
                          <div className="p-2 border rounded-md bg-gray-50">
                            {userInfo.firstName || "Not set"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Last Name</p>
                          <div className="p-2 border rounded-md bg-gray-50">
                            {userInfo.lastName || "Not set"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Email</p>
                        <div className="p-2 border rounded-md bg-gray-50">
                          {userInfo.email}
                        </div>
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Phone</p>
                        <div className="p-2 border rounded-md bg-gray-50">
                          {userInfo.phone || "Not set"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Address</p>
                        <div className="p-2 border rounded-md bg-gray-50 min-h-10">
                          {userInfo.address || "Not set"}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex space-x-2">
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={saveUserInfo}
                            disabled={isSaving}
                          >
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Recent Orders</CardTitle>
                      <Link href="/account/orders">
                        <Button variant="outline" size="sm">
                          View All Orders
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      {isOrdersLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                          <p className="mt-4 text-gray-600">Loading orders...</p>
                        </div>
                      ) : recentOrders.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                          <p className="text-gray-600 mb-4">Your recent orders will appear here</p>
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => router.push("/products")}
                          >
                            Browse Products
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {recentOrders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h3>
                                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                                </div>
                                <Badge className={`${getStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>

                              <div className="space-y-2 mb-3">
                                {order.items.slice(0, 2).map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>
                                      {item.name} x {item.quantity}
                                    </span>
                                    <span>₹{item.price * item.quantity}</span>
                                  </div>
                                ))}
                                {order.items.length > 2 && (
                                  <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                                )}
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="font-semibold">Total: ₹{order.totalAmount}</span>
                                <Link href="/account/orders">
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="wishlist" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Recent Wishlist Items</CardTitle>
                      <Link href="/account/wishlist">
                        <Button variant="outline" size="sm">
                          View All Wishlist
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      {isWishlistLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                          <p className="mt-4 text-gray-600">Loading wishlist...</p>
                        </div>
                      ) : recentWishlistItems.length === 0 ? (
                        <div className="text-center py-8">
                          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                          <p className="text-gray-600 mb-4">Save items you love for later!</p>
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => router.push("/products")}
                          >
                            Browse Products
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {recentWishlistItems.map((item) => (
                            <Card key={item.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                  {/* Product Image */}
                                  <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>

                                  {/* Product Info */}
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {item.weight && `${item.weight}`}
                                    </p>
                                    
                                    {/* Price */}
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                                      {item.originalPrice && (
                                        <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => addToCartFromWishlist(item)}
                                      disabled={!item.inStock}
                                    >
                                      <ShoppingCart className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeFromWishlist(item.id)}
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Current Password</p>
                            <div className="p-2 border rounded-md bg-gray-50 text-gray-500">
                              ••••••••
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">New Password</p>
                            <div className="p-2 border rounded-md bg-gray-50 text-gray-500">
                              ••••••••
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Confirm New Password</p>
                            <div className="p-2 border rounded-md bg-gray-50 text-gray-500">
                              ••••••••
                            </div>
                          </div>
                          <Button className="bg-green-600 hover:bg-green-700">
                            Update Password
                          </Button>
                        </div>
                      </div>

                      <hr />

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Email notifications</span>
                            <Button variant="outline" size="sm">
                              Enable
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>SMS notifications</span>
                            <Button variant="outline" size="sm">
                              Enable
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Marketing emails</span>
                            <Button variant="outline" size="sm">
                              Disable
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
"use client"
import { useEffect, useState } from "react"
import { useSession, signOut, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { User, Package, Heart, Settings, LogOut, Edit } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import LoadingScreen from "@/components/loading-screen"

const orderHistory = [
  {
    id: "ORD001",
    date: "2024-01-15",
    status: "Delivered",
    total: 447,
    items: [
      { name: "Mango Chatkara", quantity: 2, price: 149 },
      { name: "Mirch Pickle", quantity: 1, price: 129 },
    ],
  },
  {
    id: "ORD002",
    date: "2024-01-08",
    status: "Processing",
    total: 338,
    items: [{ name: "Mix Pickle", quantity: 2, price: 169 }],
  },
]

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })

  const [isEditing, setIsEditing] = useState(false)

 const fetchUserInfo = async () => {
  try {
    const res = await fetch("/api/user")
    const data = await res.json()
    if (res.ok) {
      setUserInfo({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      })
    } else {
      console.error("Failed to load user data:", data.error)
    }
  } catch (err) {
    console.error("Error fetching user info:", err)
  }
}

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn()
    }
    if (status === "authenticated") {
      fetchUserInfo()
    }
  }, [status])

  if (status === "loading") {
    return <LoadingScreen />
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
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600"
                      onClick={() => signOut({ callbackUrl: "/" })}
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
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Personal Information</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={userInfo.firstName}
                            disabled={!isEditing}
                            onChange={(e) => setUserInfo((prev) => ({ ...prev, firstName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={userInfo.lastName}
                            disabled={!isEditing}
                            onChange={(e) => setUserInfo((prev) => ({ ...prev, lastName: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userInfo.email}
                          disabled={!isEditing}
                          onChange={(e) => setUserInfo((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={userInfo.phone}
                          disabled={!isEditing}
                          onChange={(e) => setUserInfo((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={userInfo.address}
                          disabled={!isEditing}
                          onChange={(e) => setUserInfo((prev) => ({ ...prev, address: e.target.value }))}
                        />
                      </div>

                      {isEditing && (
                        <div className="flex space-x-2">
                          <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orderHistory.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold">Order #{order.id}</h3>
                                <p className="text-sm text-gray-600">{order.date}</p>
                              </div>
                              <Badge
                                variant={order.status === "Delivered" ? "default" : "secondary"}
                                className={order.status === "Delivered" ? "bg-green-600" : ""}
                              >
                                {order.status}
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.name} x {item.quantity}
                                  </span>
                                  <span>₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="font-semibold">Total: ₹{order.total}</span>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="wishlist" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Wishlist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-600 mb-4">Save items you love for later!</p>
                        <Button className="bg-green-600 hover:bg-green-700">Browse Products</Button>
                      </div>
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
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                            <Input id="confirmNewPassword" type="password" />
                          </div>
                          <Button className="bg-green-600 hover:bg-green-700">Update Password</Button>
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

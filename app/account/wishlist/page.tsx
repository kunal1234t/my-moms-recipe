// app/account/wishlist/page.tsx
"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import LoadingScreen from "@/components/loading-screen"
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"

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

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }
    
    try {
      const wishlistRef = collection(db, 'users', user.uid, 'wishlist')
      const q = query(wishlistRef)
      const querySnapshot = await getDocs(q)
      
      const items: WishlistItem[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        items.push({
          id: doc.id,
          ...data
        } as WishlistItem)
      })
      
      // Sort by added date (newest first)
      items.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      setWishlistItems(items)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast.error("Failed to load wishlist")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
      return
    }
    
    if (user) {
      fetchWishlist()
    }
  }, [user, authLoading, router, fetchWishlist])

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

  const moveAllToCart = () => {
    wishlistItems.forEach(item => {
      if (item.inStock) {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: 1,
          image: item.image,
          weight: item.weight
        })
      }
    })
    toast.success("Added all available items to cart!")
  }

  if (authLoading || isLoading) {
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
              <p className="text-gray-600">Your saved favorite products</p>
            </div>

            {/* Wishlist Actions */}
            {wishlistItems.length > 0 && (
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  {wishlistItems.length} item{wishlistItems.length > 1 ? 's' : ''} in wishlist
                </p>
                <Button 
                  onClick={moveAllToCart}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add All to Cart
                </Button>
              </div>
            )}

            {/* Wishlist Items */}
            <div className="space-y-4">
              {wishlistItems.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">Save items you love for later!</p>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => router.push("/products")}
                    >
                      Browse Products
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                wishlistItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Product Image */}
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          {item.isNew && (
                            <Badge className="absolute top-1 left-1 bg-green-600 text-white text-xs">New</Badge>
                          )}
                          {item.isBestseller && (
                            <Badge className="absolute top-1 left-1 bg-yellow-600 text-white text-xs">Bestseller</Badge>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.weight && `${item.weight} • `}
                            Category: {item.category || "General"}
                          </p>
                          
                          {/* Price */}
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                            )}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center space-x-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">({item.reviews})</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => addToCartFromWishlist(item)}
                            disabled={!item.inStock}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
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
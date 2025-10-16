// app/product/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Star, Heart, Share2, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/AuthContext"
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

type Product = {
  id: string
  name: string
  brand: string
  images: string[]
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  inStock: boolean
  description: string
  ingredients: string
  nutritionalInfo: string
  shelfLife: string
  weight: string
  isBestseller?: boolean
  isNew?: boolean
  category?: string
}

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    date: "2024-01-15",
    comment: "Absolutely delicious! Tastes just like my grandmother's homemade pickle. The quality is exceptional and the packaging is perfect.",
    verified: true,
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    rating: 4,
    date: "2024-01-10",
    comment: "Great taste and authentic flavor. The spice level is perfect. Will definitely order again.",
    verified: true,
  },
  {
    id: 3,
    name: "Meera Patel",
    rating: 5,
    date: "2024-01-08",
    comment: "Best mango pickle I've ever tasted! No artificial taste, completely natural and fresh. Highly recommended!",
    verified: true,
  },
]

export default function ProductDetailPage() {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !productId) return
      
      try {
        const wishlistDoc = await getDoc(doc(db, 'users', user.uid, 'wishlist', productId))
        setIsInWishlist(wishlistDoc.exists())
      } catch (error) {
        console.error("Error checking wishlist status:", error)
      }
    }

    checkWishlistStatus()
  }, [user, productId])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', productId)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          setProduct({
            id: docSnap.id,
            name: data.name,
            brand: data.brand || "Mom's Recipe",
            images: data.images || ["/placeholder.svg"],
            price: data.price,
            originalPrice: data.originalPrice,
            rating: data.rating || 4.5,
            reviews: data.reviews || 0,
            inStock: data.inStock !== false,
            description: data.description,
            ingredients: data.ingredients,
            nutritionalInfo: data.nutritionalInfo,
            shelfLife: data.shelfLife,
            weight: data.weight,
            isBestseller: data.isBestseller,
            isNew: data.isNew,
            category: data.category
          })
        } else {
          console.error("Product not found")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please sign in to add items to wishlist")
      return
    }

    if (!product) return

    setIsWishlistLoading(true)
    try {
      const wishlistRef = doc(db, 'users', user.uid, 'wishlist', product.id)
      
      if (isInWishlist) {
        // Remove from wishlist
        await deleteDoc(wishlistRef)
        setIsInWishlist(false)
        toast.success("Removed from wishlist")
      } else {
        // Add to wishlist
        const productData = {
          id: product.id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviews: product.reviews,
          isNew: product.isNew,
          isBestseller: product.isBestseller,
          category: product.category,
          weight: product.weight,
          inStock: product.inStock,
          addedAt: new Date()
        }
        
        await setDoc(wishlistRef, productData)
        setIsInWishlist(true)
        toast.success("Added to wishlist!")
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      toast.error("Failed to update wishlist")
    } finally {
      setIsWishlistLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you&rsquo;re looking for doesn&rsquo;t exist.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {discount > 0 && (
                  <Badge className="absolute left-4 top-4 bg-red-600 text-white">{discount}% OFF</Badge>
                )}
                {product.isBestseller && (
                  <Badge className="absolute right-4 top-4 bg-yellow-600 text-white">Bestseller</Badge>
                )}
                {product.isNew && (
                  <Badge className="absolute right-4 top-4 bg-green-600 text-white">New</Badge>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 overflow-hidden rounded-md border-2 ${
                      selectedImage === index ? "border-green-600" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews} Reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                      <Badge variant="destructive">{discount}% OFF</Badge>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-800 mb-6">In Stock</Badge>
                ) : (
                  <Badge variant="destructive" className="mb-6">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        quantity,
                        image: product.images[0],
                        weight: product.weight
                      })
                      toast.success("Added to cart!")
                    }}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={toggleWishlist}
                    disabled={isWishlistLoading}
                    className={isInWishlist ? "text-red-600 border-red-600" : ""}
                  >
                    <Heart 
                      className={`h-5 w-5 ${isInWishlist ? "fill-red-600" : ""}`} 
                    />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Free Shipping over ₹500</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Quality Assured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="additional">Additional Info</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Key Features:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          <li>No artificial colors or preservatives</li>
                          <li>Made in small batches for freshness</li>
                          <li>Traditional family recipe</li>
                          <li>Premium quality ingredients</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Storage Instructions:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          <li>Store in a cool, dry place</li>
                          <li>Keep away from direct sunlight</li>
                          <li>Refrigerate after opening</li>
                          <li>Use clean, dry spoon</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="additional" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Ingredients:</h4>
                          <p className="text-gray-700">{product.ingredients}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Net Weight:</h4>
                          <p className="text-gray-700">{product.weight}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Shelf Life:</h4>
                          <p className="text-gray-700">{product.shelfLife}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Nutritional Information (per 100g):</h4>
                        <p className="text-gray-700">{product.nutritionalInfo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Customer Reviews</h3>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">{review.name}</h4>
                                {review.verified && (
                                  <Badge variant="outline" className="text-xs">
                                    Verified Purchase
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">{review.date}</span>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
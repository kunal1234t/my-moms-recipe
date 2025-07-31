"use client"

import { useState } from "react"
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
import { useCart } from "@/context/cart-context"

// Mock product data
const productData = {
  "1": {
    id: "1",
    name: "Mom's Recipe Mango Chatkara - Premium Graded",
    brand: "Mom's Recipe",
    images: ["/images/mangopunjabi.jpg", "/images/mangopunjabi.jpg", "/images/mangopunjabi.jpg"],
    price: 149,
    originalPrice: 199,
    rating: 4.8,
    reviews: 124,
    inStock: true,
    description:
      "Our premium mango chatkara is made from carefully selected raw mangoes, blended with traditional spices and herbs. This pickle captures the authentic taste of homemade preserves, prepared in small batches to ensure maximum freshness and flavor. No artificial colors or preservatives are used in our preparation process.",
    ingredients: "Raw Mango, Mustard Oil, Red Chili Powder, Turmeric, Fenugreek Seeds, Mustard Seeds, Asafoetida, Salt",
    nutritionalInfo: "Energy: 45 kcal per 100g, Carbohydrates: 8g, Fat: 2g, Protein: 1g, Sodium: 850mg",
    shelfLife: "12 months from date of manufacture",
    weight: "400g",
    isBestseller: true,
  },
  "2": {
    id: "2",
    name: "Mom's Recipe Mirch Pickle - Spicy & Tangy",
    brand: "Mom's Recipe",
    images: ["/images/mirch.jpg", "/images/mirch.jpg", "/images/mirch.jpg"],
    price: 129,
    originalPrice: 159,
    rating: 4.6,
    reviews: 89,
    inStock: true,
    description:
      "A fiery blend of fresh green chilies and aromatic spices, our mirch pickle is perfect for spice lovers. Made using traditional recipes passed down through generations.",
    ingredients: "Green Chili, Mustard Oil, Turmeric, Red Chili Powder, Fenugreek Seeds, Mustard Seeds, Salt",
    nutritionalInfo: "Energy: 35 kcal per 100g, Carbohydrates: 6g, Fat: 1.5g, Protein: 1.2g, Sodium: 900mg",
    shelfLife: "12 months from date of manufacture",
    weight: "350g",
    isNew: true,
  },
  "3": {
    id: "3",
    name: "Mango Pickle (Punjabi Style) - 1kg",
    brand: "Mom's Recipe",
    images: ["/images/mangopunjabi.jpg", "/images/mangopunjabi.jpg", "/images/mangopunjabi.jpg"],
    price: 475,
    originalPrice: 525,
    rating: 4.7,
    reviews: 156,
    inStock: true,
    description:
      "Authentic Punjabi style mango pickle with robust flavors and traditional spices. Perfect accompaniment to any meal with its tangy and spicy taste profile.",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Fennel, Nigella Seeds",
    nutritionalInfo: "Energy: 50 kcal per 100g, Carbohydrates: 9g, Fat: 2.5g, Protein: 1.2g, Sodium: 800mg",
    shelfLife: "12 months",
    weight: "1kg",
    isBestseller: true,
  },
  "4": {
    id: "4",
    name: "Mango Pickle (Punjabi Style) - 400g",
    brand: "Mom's Recipe",
    images: ["/images/mangopunjabi.jpg", "/images/mangopunjabi.jpg", "/images/mangopunjabi.jpg"],
    price: 190,
    originalPrice: 220,
    rating: 4.6,
    reviews: 98,
    inStock: true,
    description: "Same great Punjabi style mango pickle in a convenient 400g pack.",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Fennel, Nigella Seeds",
    nutritionalInfo: "Energy: 50 kcal per 100g, Carbohydrates: 9g, Fat: 2.5g, Protein: 1.2g, Sodium: 800mg",
    shelfLife: "12 months",
    weight: "400g",
  },
  "5": {
    id: "5",
    name: "Mango Chatkara - 1kg",
    brand: "Mom's Recipe",
    images: ["/images/mangochatkara.jpg", "/images/mangochatkara.jpg", "/images/mangochatkara.jpg"],
    price: 600,
    originalPrice: 650,
    rating: 4.9,
    reviews: 210,
    inStock: true,
    description:
      "Special chatkara variety with extra tanginess and spice. Made from specially selected mangoes for that perfect balance of sour and spicy flavors.",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Asafoetida, Mustard Seeds",
    nutritionalInfo: "Energy: 48 kcal per 100g, Carbohydrates: 8.5g, Fat: 2.2g, Protein: 1.1g, Sodium: 820mg",
    shelfLife: "12 months",
    weight: "1kg",
    isBestseller: true,
  },
  "6": {
    id: "6",
    name: "Mango Chatkara - 500g",
    brand: "Mom's Recipe",
    images: ["/images/mangochatkara.jpg", "/images/mangochatkara.jpg", "/images/mangochatkara.jpg"],
    price: 310,
    originalPrice: 350,
    rating: 4.8,
    reviews: 145,
    inStock: true,
    description: "The same delicious mango chatkara in a 500g pack.",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Asafoetida, Mustard Seeds",
    nutritionalInfo: "Energy: 48 kcal per 100g, Carbohydrates: 8.5g, Fat: 2.2g, Protein: 1.1g, Sodium: 820mg",
    shelfLife: "12 months",
    weight: "500g",
  },
  "7": {
    id: "7",
    name: "Mango Chatkara - 200g",
    brand: "Mom's Recipe",
    images: ["/images/mangochatkara.jpg", "/images/mangochatkara.jpg", "/images/mangochatkara.jpg"],
    price: 145,
    originalPrice: 175,
    rating: 4.7,
    reviews: 87,
    inStock: true,
    description: "Perfect trial size of our famous mango chatkara pickle.",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Asafoetida, Mustard Seeds",
    nutritionalInfo: "Energy: 48 kcal per 100g, Carbohydrates: 8.5g, Fat: 2.2g, Protein: 1.1g, Sodium: 820mg",
    shelfLife: "12 months",
    weight: "200g",
  },
  "8": {
    id: "8",
    name: "Mirchi Pickle - 400g",
    brand: "Mom's Recipe",
    images: ["/images/mirch.jpg", "/images/mirch.jpg", "/images/mirch.jpg"],
    price: 250,
    originalPrice: 290,
    rating: 4.5,
    reviews: 112,
    inStock: true,
    description:
      "Spicy green chili pickle that adds fire to your meals. Made from fresh green chilies and traditional spices for authentic flavor.",
    ingredients: "Green Chilies, Mustard Oil, Salt, Turmeric, Fenugreek, Mustard Seeds, Asafoetida",
    nutritionalInfo: "Energy: 38 kcal per 100g, Carbohydrates: 6.5g, Fat: 1.8g, Protein: 1.3g, Sodium: 850mg",
    shelfLife: "12 months",
    weight: "400g",
  },
  "9": {
    id: "9",
    name: "Mirchi Pickle - 200g",
    brand: "Mom's Recipe",
    images: ["/images/mirch.jpg", "/images/mirch.jpg", "/images/mirch.jpg"],
    price: 125,
    originalPrice: 150,
    rating: 4.4,
    reviews: 76,
    inStock: true,
    description: "Small pack of our fiery mirchi pickle for those who love heat in their meals.",
    ingredients: "Green Chilies, Mustard Oil, Salt, Turmeric, Fenugreek, Mustard Seeds, Asafoetida",
    nutritionalInfo: "Energy: 38 kcal per 100g, Carbohydrates: 6.5g, Fat: 1.8g, Protein: 1.3g, Sodium: 850mg",
    shelfLife: "12 months",
    weight: "200g",
  },
  "10": {
    id: "10",
    name: "Garlic Pickle - 400g",
    brand: "Mom's Recipe",
    images: ["/images/garlic.jpg", "/images/garlic.jpg", "/images/garlic.jpg"],
    price: 300,
    originalPrice: 350,
    rating: 4.7,
    reviews: 134,
    inStock: true,
    description:
      "Flavorful garlic pickle with health benefits. Made from fresh garlic cloves marinated in spices and mustard oil.",
    ingredients: "Garlic, Mustard Oil, Salt, Red Chili Powder, Turmeric, Lemon Juice, Mustard Seeds",
    nutritionalInfo: "Energy: 55 kcal per 100g, Carbohydrates: 10g, Fat: 2g, Protein: 2g, Sodium: 780mg",
    shelfLife: "12 months",
    weight: "400g",
  },
  "11": {
    id: "11",
    name: "Garlic Pickle - 200g",
    brand: "Mom's Recipe",
    images: ["/images/garlic.jpg", "/images/garlic.jpg", "/images/garlic.jpg"],
    price: 150,
    originalPrice: 180,
    rating: 4.6,
    reviews: 89,
    inStock: true,
    description: "Smaller pack of our popular garlic pickle with all the same great flavors.",
    ingredients: "Garlic, Mustard Oil, Salt, Red Chili Powder, Turmeric, Lemon Juice, Mustard Seeds",
    nutritionalInfo: "Energy: 55 kcal per 100g, Carbohydrates: 10g, Fat: 2g, Protein: 2g, Sodium: 780mg",
    shelfLife: "12 months",
    weight: "200g",
  },
  "12": {
    id: "12",
    name: "Sweet Lemon Pickle - 500g",
    brand: "Mom's Recipe",
    images: ["/images/sweetlemon.jpg", "/images/sweetlemon.jpg", "/images/sweetlemon.jpg"],
    price: 250,
    originalPrice: 280,
    rating: 4.6,
    reviews: 102,
    inStock: true,
    description:
      "Sweet and tangy lemon pickle with a perfect balance of flavors. Great as a condiment or even as a spread.",
    ingredients: "Lemon, Sugar, Salt, Red Chili Powder, Turmeric, Mustard Seeds, Fenugreek, Asafoetida",
    nutritionalInfo: "Energy: 120 kcal per 100g, Carbohydrates: 25g, Fat: 1.5g, Protein: 1g, Sodium: 600mg",
    shelfLife: "10 months",
    weight: "500g",
  },
  "13": {
    id: "13",
    name: "Sweet Lemon Pickle - 250g",
    brand: "Mom's Recipe",
    images: ["/images/sweetlemon.jpg", "/images/sweetlemon.jpg", "/images/sweetlemon.jpg"],
    price: 135,
    originalPrice: 150,
    rating: 4.5,
    reviews: 67,
    inStock: true,
    description: "Half-size pack of our popular sweet lemon pickle.",
    ingredients: "Lemon, Sugar, Salt, Red Chili Powder, Turmeric, Mustard Seeds, Fenugreek, Asafoetida",
    nutritionalInfo: "Energy: 120 kcal per 100g, Carbohydrates: 25g, Fat: 1.5g, Protein: 1g, Sodium: 600mg",
    shelfLife: "10 months",
    weight: "250g",
  },
  "14": {
    id: "14",
    name: "Chatpata Lemon Pickle - 500g",
    brand: "Mom's Recipe",
    images: ["/images/chatpatalemon.jpg", "/images/chatpatalemon.jpg", "/images/chatpatalemon.jpg"],
    price: 250,
    originalPrice: 280,
    rating: 4.7,
    reviews: 118,
    inStock: true,
    description:
      "Spicy and tangy lemon pickle with bold flavors. Perfect for those who love a bit of heat with their sour.",
    ingredients: "Lemon, Salt, Red Chili Powder, Turmeric, Mustard Seeds, Fenugreek, Asafoetida, Mustard Oil",
    nutritionalInfo: "Energy: 45 kcal per 100g, Carbohydrates: 8g, Fat: 2g, Protein: 1g, Sodium: 900mg",
    shelfLife: "12 months",
    weight: "500g",
  },
  "15": {
    id: "15",
    name: "Chatpata Lemon Pickle - 250g",
    brand: "Mom's Recipe",
    images: ["/images/chatpatalemon.jpg", "/images/chatpatalemon.jpg", "/images/chatpatalemon.jpg"],
    price: 135,
    originalPrice: 150,
    rating: 4.6,
    reviews: 72,
    inStock: true,
    description: "Smaller pack of our spicy chatpata lemon pickle with all the same great flavors.",
    ingredients: "Lemon, Salt, Red Chili Powder, Turmeric, Mustard Seeds, Fenugreek, Asafoetida, Mustard Oil",
    nutritionalInfo: "Energy: 45 kcal per 100g, Carbohydrates: 8g, Fat: 2g, Protein: 1g, Sodium: 900mg",
    shelfLife: "12 months",
    weight: "250g",
  },
  "16": {
    id: "16",
    name: "Mix Pickle - 400g",
    brand: "Mom's Recipe",
    images: ["/images/mixpickle.jpg", "/images/mixpickle.jpg", "/images/mixpickle.jpg"],
    price: 200,
    originalPrice: 240,
    rating: 4.6,
    reviews: 95,
    inStock: true,
    description:
      "Assorted vegetable pickle with mango, lemon, carrot, and other seasonal vegetables. A perfect blend of flavors in every bite.",
    ingredients: "Mango, Lemon, Carrot, Cauliflower, Mustard Oil, Salt, Spices, Turmeric, Fenugreek",
    nutritionalInfo: "Energy: 50 kcal per 100g, Carbohydrates: 9g, Fat: 2g, Protein: 1.5g, Sodium: 850mg",
    shelfLife: "12 months",
    weight: "400g",
  }
}

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    date: "2024-01-15",
    comment:
      "Absolutely delicious! Tastes just like my grandmother's homemade pickle. The quality is exceptional and the packaging is perfect.",
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
    comment:
      "Best mango pickle I've ever tasted! No artificial taste, completely natural and fresh. Highly recommended!",
    verified: true,
  },
]

export default function ProductDetailPage() {
  const { addToCart } = useCart()
  
  const params = useParams()
  const productId = params.id as string
  const product = productData[productId as keyof typeof productData]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return <div>Product not found</div>
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

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
                {discount > 0 && <Badge className="absolute left-4 top-4 bg-red-600 text-white">{discount}% OFF</Badge>}
                {product.isBestseller && (
                  <Badge className="absolute right-4 top-4 bg-yellow-600 text-white">Bestseller</Badge>
                )}
                {product.isNew && <Badge className="absolute right-4 top-4 bg-green-600 text-white">New</Badge>}
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
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                  <Badge variant="destructive">{discount}% OFF</Badge>
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
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity,
                        image: product.images[0],
                      })
                    }
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>

                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
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
                  <span className="text-sm">Free Shipping</span>
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
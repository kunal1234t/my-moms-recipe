"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

type Product = {
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
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'))
        const productsData: Product[] = []
        
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          productsData.push({
            id: doc.id,
            name: data.name,
            image: data.images?.[0] || "/placeholder.svg",
            price: data.price,
            originalPrice: data.originalPrice,
            rating: data.rating || 4.5,
            reviews: data.reviews || 0,
            isNew: data.isNew || false,
            isBestseller: data.isBestseller || false,
            category: data.category,
            weight: data.weight,
            inStock: data.inStock !== false
          })
        })
        
        // Get random 4 products from all available products
        const randomProducts = productsData
          .filter(product => product.inStock) // Only in-stock products
          .sort(() => Math.random() - 0.5) // Shuffle randomly
          .slice(0, 4) // Take first 4
        
        setProducts(randomProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Popular Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our authentic home-made pickles and chutneys, prepared with traditional recipes and the finest
              ingredients.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 aspect-square rounded-lg mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Popular Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our authentic home-made pickles and chutneys, prepared with traditional recipes and the finest
              ingredients.
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">No products found. Please check back later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Popular Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our authentic home-made pickles and chutneys, prepared with traditional recipes and the finest
            ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
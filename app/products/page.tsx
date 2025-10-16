"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

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
        
        setProducts(productsData)
        setFilteredProducts(productsData)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleSort = (value: string) => {
    let sorted = [...filteredProducts]
    switch (value) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        sorted = filteredProducts.filter((p) => p.isNew)
        break
      case "popular":
      default:
        sorted = [...filteredProducts]
    }
    setFilteredProducts(sorted)
  }

  const filterByCategory = (category: string) => {
    if (category === "all") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product => 
        product.category?.toLowerCase().includes(category.toLowerCase()) ||
        product.name.toLowerCase().includes(category.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
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
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-green-600 to-yellow-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Discover our complete range of authentic home-made pickles, chutneys, and preserves
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => filterByCategory("all")}>
                All Products
              </Button>
              <Button variant="outline" size="sm" onClick={() => filterByCategory("mango")}>
                Mango Pickles
              </Button>
              <Button variant="outline" size="sm" onClick={() => filterByCategory("chili")}>
                Chili Pickles
              </Button>
              <Button variant="outline" size="sm" onClick={() => filterByCategory("lemon")}>
                Lemon Pickles
              </Button>
              <Button variant="outline" size="sm" onClick={() => filterByCategory("garlic")}>
                Garlic Pickles
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilteredProducts(products.filter(p => p.isNew))}>
                New Arrivals
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilteredProducts(products.filter(p => p.isBestseller))}>
                Bestsellers
              </Button>
            </div>
            <Select onValueChange={handleSort}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found. Please try a different filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
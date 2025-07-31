"use client"

import { useState } from "react"
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

type Product = {
  id: string
  name: string
  image: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  isNew?: boolean
  isBestseller?: boolean
}

const allProducts: Product[] = [
  {
    id: "1",
    name: "Mom's Recipe Mango Chatkara - Premium Graded (400g)",
    image: "/images/mangopunjabi.jpg",
    price: 149,
    originalPrice: 199,
    rating: 4.8,
    reviews: 124,
    isBestseller: true,
  },
  {
    id: "2",
    name: "Mom's Recipe Mirch Pickle - Spicy & Tangy (400g)",
    image: "/images/mirch.jpg",
    price: 129,
    originalPrice: 159,
    rating: 4.6,
    reviews: 89,
    isNew: true,
  },
  {
    id: "3",
    name: "Mango Pickle (Punjabi Style) - 1kg",
    image: "/images/mangopunjabi.jpg",
    price: 475,
    originalPrice: 525,
    rating: 4.7,
    reviews: 156,
    isBestseller: true,
  },
  {
    id: "4",
    name: "Mango Pickle (Punjabi Style) - 400g",
    image: "/images/mangopunjabi.jpg",
    price: 190,
    originalPrice: 220,
    rating: 4.6,
    reviews: 98,
  },
  {
    id: "5",
    name: "Mango Chatkara - 1kg",
    image: "/images/mangochatkara.jpg",
    price: 600,
    originalPrice: 650,
    rating: 4.9,
    reviews: 210,
    isBestseller: true,
  },
  {
    id: "6",
    name: "Mango Chatkara - 500g",
    image: "/images/mangochatkara.jpg",
    price: 310,
    originalPrice: 350,
    rating: 4.8,
    reviews: 145,
  },
  {
    id: "7",
    name: "Mango Chatkara - 200g",
    image: "/images/mangochatkara.jpg",
    price: 145,
    originalPrice: 175,
    rating: 4.7,
    reviews: 87,
  },
  {
    id: "8",
    name: "Mirchi Pickle - 400g",
    image: "/images/mirch.jpg",
    price: 250,
    originalPrice: 290,
    rating: 4.5,
    reviews: 112,
  },
  {
    id: "9",
    name: "Mirchi Pickle - 200g",
    image: "/images/mirch.jpg",
    price: 125,
    originalPrice: 150,
    rating: 4.4,
    reviews: 76,
  },
  {
    id: "10",
    name: "Garlic Pickle - 400g",
    image: "/images/garlic.jpg",
    price: 300,
    originalPrice: 350,
    rating: 4.7,
    reviews: 134,
  },
  {
    id: "11",
    name: "Garlic Pickle - 200g",
    image: "/images/garlic.jpg",
    price: 150,
    originalPrice: 180,
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "12",
    name: "Sweet Lemon Pickle - 500g",
    image: "/images/sweetlemon.jpg",
    price: 250,
    originalPrice: 280,
    rating: 4.6,
    reviews: 102,
  },
  {
    id: "13",
    name: "Sweet Lemon Pickle - 250g",
    image: "/images/sweetlemon.jpg",
    price: 135,
    originalPrice: 150,
    rating: 4.5,
    reviews: 67,
  },
  {
    id: "14",
    name: "Chatpata Lemon Pickle - 500g",
    image: "/images/chatpatalemon.jpg",
    price: 250,
    originalPrice: 280,
    rating: 4.7,
    reviews: 118,
  },
  {
    id: "15",
    name: "Chatpata Lemon Pickle - 250g",
    image: "/images/chatpatalemon.jpg",
    price: 135,
    originalPrice: 150,
    rating: 4.6,
    reviews: 72,
  },
  {
    id: "16",
    name: "Mix Pickle - 400g",
    image: "/images/mixpickle.jpg",
    price: 200,
    originalPrice: 240,
    rating: 4.6,
    reviews: 95,
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(allProducts)

  const handleSort = (value: string) => {
    let sorted = [...products]
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
        sorted = allProducts.filter((p) => p.isNew)
        break
      case "popular":
      default:
        sorted = [...allProducts]
    }
    setProducts(sorted)
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
              <Button variant="outline" size="sm" onClick={() => setProducts(allProducts)}>
                All Products
              </Button>
              <Button variant="outline" size="sm" onClick={() => setProducts(allProducts.filter(p => p.name.toLowerCase().includes("mango")))}>
                Mango Pickles
              </Button>
              <Button variant="outline" size="sm" onClick={() => setProducts(allProducts.filter(p => p.name.toLowerCase().includes("mirchi") || p.name.toLowerCase().includes("chili")))}>
                Chili Pickles
              </Button>
              <Button variant="outline" size="sm" onClick={() => setProducts(allProducts.filter(p => p.name.toLowerCase().includes("lemon")))}>
                Lemon Pickles
              </Button>
              <Button variant="outline" size="sm" onClick={() => setProducts(allProducts.filter(p => p.name.toLowerCase().includes("garlic")))}>
                Garlic Pickles
              </Button>
              <Button variant="outline" size="sm" onClick={() => setProducts(allProducts.filter(p => p.isNew))}>
                New Arrivals
              </Button>
              <Button variant="outline" size="sm" onClick={() => setProducts(allProducts.filter(p => p.isBestseller))}>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" disabled>
              Load More Products
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
"use client"

import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  isNew?: boolean
  isBestseller?: boolean
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviews,
  isNew,
  isBestseller,
}: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Link href={`/products/${id}`} className="block">
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isNew && <Badge className="absolute left-2 top-2 bg-green-600">New</Badge>}
          {isBestseller && <Badge className="absolute left-2 top-2 bg-yellow-600">Bestseller</Badge>}
          {discount > 0 && <Badge className="absolute right-2 top-2 bg-red-600">{discount}% OFF</Badge>}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{name}</h3>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">({reviews})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-600">₹{price}</span>
            {originalPrice && <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // Add to cart logic here
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

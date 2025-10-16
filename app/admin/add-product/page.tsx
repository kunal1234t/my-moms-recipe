// app/admin/add-product/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { uploadMultipleImages } from "@/utils/uploadImages"

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    brand: "Mom's Recipe",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    weight: "",
    ingredients: "",
    nutritionalInfo: "",
    shelfLife: "12 months",
    rating: "4.5",
    reviews: "0",
  })
  const [images, setImages] = useState<File[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setImages(filesArray)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload images first
      let imageUrls: string[] = []
      if (images.length > 0) {
        imageUrls = await uploadMultipleImages(images, `product-${Date.now()}`)
      }

      // Prepare product data
      const productData = {
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        images: imageUrls,
        inStock: true,
        weight: formData.weight,
        ingredients: formData.ingredients,
        nutritionalInfo: formData.nutritionalInfo,
        shelfLife: formData.shelfLife,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        isBestseller: false,
        isNew: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'products'), productData)
      console.log('Product added with ID:', docRef.id); // Add this line

      toast.success(`Product "${formData.name}" added successfully!`)
      router.push('/admin/products')
      
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  placeholder="mango, chili, lemon, garlic, mixed"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (₹)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight *</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="400g, 1kg, etc."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="images">Product Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients *</Label>
              <Textarea
                id="ingredients"
                rows={3}
                value={formData.ingredients}
                onChange={(e) => handleInputChange("ingredients", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutritionalInfo">Nutritional Information</Label>
              <Textarea
                id="nutritionalInfo"
                rows={3}
                value={formData.nutritionalInfo}
                onChange={(e) => handleInputChange("nutritionalInfo", e.target.value)}
              />
            </div>

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
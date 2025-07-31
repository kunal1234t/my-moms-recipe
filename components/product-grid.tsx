import ProductCard from "./product-card"

const products = [
  {
    id: "1",
    name: "Mom's Recipe Mango Chatkara - Premium Graded",
    image: "/images/mango.jpg",
    price: 149,
    originalPrice: 199,
    rating: 4.8,
    reviews: 124,
    isBestseller: true,
  },
  {
    id: "2",
    name: "Mom's Recipe Mirch Pickle - Spicy & Tangy",
    image: "/images/mirch.jpg",
    price: 129,
    originalPrice: 159,
    rating: 4.6,
    reviews: 89,
    isNew: true,
  },
  {
    id: "3",
    name: "Mom's Recipe Mix Pickle - Assorted Vegetables",
    image: "/images/mix.jpg",
    price: 169,
    originalPrice: 219,
    rating: 4.7,
    reviews: 156,
    isBestseller: true,
  },
  {
    id: "4",
    name: "Mom's Recipe Mango Pickle Combo - 2 Jars",
    image: "/images/mongo-combo.jpg",
    price: 279,
    originalPrice: 349,
    rating: 4.9,
    reviews: 203,
    isNew: true,
  },
]

export default function ProductGrid() {
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

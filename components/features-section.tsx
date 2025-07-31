import { Shield, Truck, Award, Heart } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "No Artificial Preservatives",
    description: "Made with natural ingredients, no artificial colors or preservatives",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Traditional family recipes passed down through generations",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Carefully selected ingredients and small batch production",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Free shipping on orders above ₹500, delivered fresh to your door",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Mom's Recipe?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to bringing you the authentic taste of home-made pickles with the highest quality standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                <feature.icon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

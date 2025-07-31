import Image from "next/image"
import { Award, Heart, Users, Leaf } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every jar is prepared with care using traditional family recipes passed down through generations.",
  },
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description:
      "We use only the finest, naturally sourced ingredients without any artificial preservatives or colors.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Our products undergo rigorous quality checks to ensure the highest standards of taste and safety.",
  },
  {
    icon: Users,
    title: "Family Business",
    description: "A family-owned business committed to bringing authentic homemade flavors to your table.",
  },
]

const timeline = [
  {
    year: "1995",
    title: "The Beginning",
    description: "Started as a small home kitchen operation by Mrs. Niranjan Devi with traditional family recipes.",
  },
  {
    year: "2005",
    title: "First Commercial Production",
    description: "Expanded to serve local markets with our signature mango and mixed vegetable pickles.",
  },
  {
    year: "2015",
    title: "Brand Recognition",
    description: "Gained recognition across North India for authentic taste and quality products.",
  },
  {
    year: "2024",
    title: "Digital Expansion",
    description: "Launched online platform to serve customers nationwide with home delivery services.",
  },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-yellow-600 py-20">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About My Mom's Recipe</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Bringing you authentic home-made pickles and preserves with traditional recipes and love
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    My Mom's Recipe began in 1995 when Mrs. Niranjan Devi started making pickles and preserves in her
                    small kitchen in Faridabad, Haryana. What started as a way to preserve seasonal vegetables and
                    fruits for her family soon became a passion that would touch thousands of lives.
                  </p>
                  <p>
                    Using recipes passed down through generations, she began sharing her delicious creations with
                    neighbors and friends. The authentic taste and quality of her products quickly gained recognition,
                    and word spread about the exceptional pickles made with love and traditional methods.
                  </p>
                  <p>
                    Today, My Mom's Recipe has grown into a trusted brand, but we've never forgotten our roots. Every
                    jar still carries the same love, care, and authentic taste that Mrs. Niranjan Devi put into her very
                    first batch nearly three decades ago.
                  </p>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/images/banner2.png"
                  alt="Founder Niranjan Devi"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide us in creating authentic, high-quality products for your family
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <value.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From a small kitchen to serving families across India
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {item.year.slice(-2)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                            {item.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-700">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gradient-to-r from-green-50 to-yellow-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              To preserve and share the authentic taste of traditional Indian pickles and preserves, made with natural
              ingredients and time-honored recipes. We are committed to bringing the warmth and love of homemade food to
              every family, while maintaining the highest standards of quality and authenticity.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

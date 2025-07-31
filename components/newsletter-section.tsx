import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-yellow-600">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated with Our Latest Recipes</h2>
          <p className="text-lg mb-8 opacity-90">
            Subscribe to our newsletter and get exclusive offers, new product launches, and traditional recipe tips
            delivered to your inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-white text-gray-900 border-0"
            />
            <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>

          <p className="text-sm mt-4 opacity-75">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}

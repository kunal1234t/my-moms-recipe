"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-yellow-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              We&rsquo;d love to hear from you. Send us a message and we&rsquo;ll respond as soon as possible.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    Visit Our Store
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Indra Enclave Sec. 21D,
                    <br />
                    Faridabad-121001,
                    <br />
                    Haryana, India
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-green-600" />
                    Call Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">+91 123-456-7890</p>
                  <p className="text-gray-700">+91 987-654-3210</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-green-600" />
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">hello@momsrecipe.com</p>
                  <p className="text-gray-700">support@momsrecipe.com</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-green-600" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-gray-700">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">What are your shipping charges?</h3>
                      <p className="text-gray-700">
                        We offer free shipping on orders above ₹500. For orders below ₹500, shipping charges are ₹50.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">How long do your products last?</h3>
                      <p className="text-gray-700">
                        Our pickles have a shelf life of 12 months from the date of manufacture when stored properly.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Do you use artificial preservatives?</h3>
                      <p className="text-gray-700">
                        No, we don&rsquo;t use any artificial colors or preservatives. All our products are made with natural
                        ingredients.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Can I return a product if I&rsquo;m not satisfied?</h3>
                      <p className="text-gray-700">
                        Yes, we have a 7-day return policy for unopened products. Please contact us for return
                        procedures.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Do you offer bulk orders for events?</h3>
                      <p className="text-gray-700">
                        Yes, we provide special pricing for bulk orders. Please contact us directly for custom quotes.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">How should I store the pickles?</h3>
                      <p className="text-gray-700">
                        Store in a cool, dry place away from direct sunlight. Refrigerate after opening and use a clean,
                        dry spoon.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

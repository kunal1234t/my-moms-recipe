"use client"

import { useState, useEffect } from "react"
import LoadingScreen from "@/components/loading-screen"
import Header from "@/components/header"
import HeroSlider from "@/components/hero-slider"
import ProductGrid from "@/components/product-grid"
import BannerSection from "@/components/banner-section"
import FeaturesSection from "@/components/features-section"
import NewsletterSection from "@/components/newsletter-section"
import Footer from "@/components/footer"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <Header />
        <main>
          <HeroSlider />
          <ProductGrid />
          <BannerSection />
          <FeaturesSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    </>
  )
}

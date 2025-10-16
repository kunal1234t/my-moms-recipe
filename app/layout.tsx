import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "sonner"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: "My Mom's Recipe - Authentic Home-Made Pickles",
    template: "%s | My Mom's Recipe"
  },
  description: "Discover authentic home-made pickles, chutneys, and preserves made with traditional recipes and premium quality ingredients. No artificial colors or preservatives.",
  keywords: [
    "pickles",
    "chutneys",
    "home-made",
    "authentic",
    "traditional",
    "mango pickle",
    "mirch pickle",
    "garlic pickle",
    "lemon pickle",
    "mix pickle",
    "preserves",
    "homemade food",
    "Indian pickles"
  ],
  authors: [{ name: "My Mom's Recipe", url: "https://mymomsrecipe.com" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mymomsrecipe.com",
    siteName: "My Mom's Recipe",
    title: "Authentic Home-Made Pickles & Chutneys",
    description: "Traditional recipes passed down through generations",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "My Mom's Recipe Products"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "My Mom's Recipe - Authentic Home-Made Pickles",
    description: "Traditional recipes passed down through generations",
    images: ["/images/og-image.jpg"]
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest"
}

export const viewport: Viewport = {
  themeColor: "#16a34a",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster 
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  toast: 'font-sans',
                  title: 'font-medium'
                }
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
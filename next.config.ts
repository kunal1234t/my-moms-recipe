// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.ibb.co',
      'images.unsplash.com',
      'via.placeholder.com',
      'firebasestorage.googleapis.com', // Add Firebase Storage domain
      'lh3.googleusercontent.com' // Firebase Storage sometimes uses this
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
// utils/imgbbImages.ts

// Replace these URLs with your actual ImgBB direct links
export const IMGBB_IMAGES = {
  // Logo
  logo: 'https://i.ibb.co/hFdxWn0P/logo.jpg',
  
  // Banner/Hero Images
  homeBanner1: 'https://i.ibb.co/7JW4y8q1/Slider1.png',
  homeBanner2: 'https://i.ibb.co/TB7JLR0c/Slider2.png',
  productBanner1: 'https://i.ibb.co/FbQB12dB/Banner1.jpg',
  productBanner2: 'https://i.ibb.co/7Jkq1ghB/Banner2.png',
  
  placeholder: 'https://i.ibb.co.com/your-placeholder-id/placeholder.jpg',
  placeholderProduct: 'https://i.ibb.co.com/your-placeholder-id/placeholder-product.jpg',
};

// Helper function to get image URL
export const getImgBBImage = (imageKey: keyof typeof IMGBB_IMAGES) => {
  return IMGBB_IMAGES[imageKey];
};

// Fallback to placeholder if image not found
export const getProductImage = (productId: string, imageName?: string) => {
  const key = imageName as keyof typeof IMGBB_IMAGES;
  return IMGBB_IMAGES[key] || IMGBB_IMAGES.placeholderProduct;
};
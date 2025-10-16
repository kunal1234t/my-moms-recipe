// scripts/seed-firebase-with-images.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Product data with image file references
const products = [
  {
    name: "Mango Pickle (Punjabi Style) - 1kg",
    brand: "Mom's Recipe",
    description: "Authentic Punjabi style mango pickle with robust flavors and traditional spices. Perfect accompaniment to any meal with its tangy and spicy taste profile.",
    price: 475,
    originalPrice: 525,
    category: "mango",
    images: ["mangopunjabi.jpg"],
    inStock: true,
    weight: "1kg",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Fennel, Nigella Seeds",
    nutritionalInfo: "Energy: 50 kcal per 100g, Carbohydrates: 9g, Fat: 2.5g, Protein: 1.2g, Sodium: 800mg",
    shelfLife: "12 months",
    rating: 4.7,
    reviews: 156,
    isBestseller: true,
    isNew: false,
  },
  {
    name: "Mango Pickle (Punjabi Style) - 400g",
    brand: "Mom's Recipe",
    description: "Same great Punjabi style mango pickle in a convenient 400g pack.",
    price: 190,
    originalPrice: 220,
    category: "mango",
    images: ["mangopunjabi.jpg"],
    inStock: true,
    weight: "400g",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Fennel, Nigella Seeds",
    nutritionalInfo: "Energy: 50 kcal per 100g, Carbohydrates: 9g, Fat: 2.5g, Protein: 1.2g, Sodium: 800mg",
    shelfLife: "12 months",
    rating: 4.6,
    reviews: 98,
    isBestseller: false,
    isNew: false,
  },
  {
    name: "Mango Chatkara - 1kg",
    brand: "Mom's Recipe",
    description: "Special chatkara variety with extra tanginess and spice. Made from specially selected mangoes for that perfect balance of sour and spicy flavors.",
    price: 600,
    originalPrice: 650,
    category: "mango",
    images: ["mangochatkara.jpg"],
    inStock: true,
    weight: "1kg",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Asafoetida, Mustard Seeds",
    nutritionalInfo: "Energy: 48 kcal per 100g, Carbohydrates: 8.5g, Fat: 2.2g, Protein: 1.1g, Sodium: 820mg",
    shelfLife: "12 months",
    rating: 4.9,
    reviews: 210,
    isBestseller: true,
    isNew: false,
  },
  {
    name: "Mango Chatkara - 500g",
    brand: "Mom's Recipe",
    description: "The same delicious mango chatkara in a 500g pack.",
    price: 310,
    originalPrice: 350,
    category: "mango",
    images: ["mangochatkara.jpg"],
    inStock: true,
    weight: "500g",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Asafoetida, Mustard Seeds",
    nutritionalInfo: "Energy: 48 kcal per 100g, Carbohydrates: 8.5g, Fat: 2.2g, Protein: 1.1g, Sodium: 820mg",
    shelfLife: "12 months",
    rating: 4.8,
    reviews: 145,
    isBestseller: false,
    isNew: false,
  },
  {
    name: "Mirchi Pickle - 400g",
    brand: "Mom's Recipe",
    description: "Spicy green chili pickle that adds fire to your meals. Made from fresh green chilies and traditional spices for authentic flavor.",
    price: 250,
    originalPrice: 290,
    category: "chili",
    images: ["mirch.jpg"],
    inStock: true,
    weight: "400g",
    ingredients: "Green Chilies, Mustard Oil, Salt, Turmeric, Fenugreek, Mustard Seeds, Asafoetida",
    nutritionalInfo: "Energy: 38 kcal per 100g, Carbohydrates: 6.5g, Fat: 1.8g, Protein: 1.3g, Sodium: 850mg",
    shelfLife: "12 months",
    rating: 4.5,
    reviews: 112,
    isBestseller: false,
    isNew: true,
  },
  {
    name: "Garlic Pickle - 400g",
    brand: "Mom's Recipe",
    description: "Flavorful garlic pickle with health benefits. Made from fresh garlic cloves marinated in spices and mustard oil.",
    price: 300,
    originalPrice: 350,
    category: "garlic",
    images: ["garlic.jpg"],
    inStock: true,
    weight: "400g",
    ingredients: "Garlic, Mustard Oil, Salt, Red Chili Powder, Turmeric, Lemon Juice, Mustard Seeds",
    nutritionalInfo: "Energy: 55 kcal per 100g, Carbohydrates: 10g, Fat: 2g, Protein: 2g, Sodium: 780mg",
    shelfLife: "12 months",
    rating: 4.7,
    reviews: 134,
    isBestseller: false,
    isNew: false,
  },
  {
    name: "Sweet Lemon Pickle - 500g",
    brand: "Mom's Recipe",
    description: "Sweet and tangy lemon pickle with a perfect balance of flavors. Great as a condiment or even as a spread.",
    price: 250,
    originalPrice: 280,
    category: "lemon",
    images: ["sweetlemon.jpg"],
    inStock: true,
    weight: "500g",
    ingredients: "Lemon, Sugar, Salt, Red Chili Powder, Turmeric, Mustard Seeds, Fenugreek, Asafoetida",
    nutritionalInfo: "Energy: 120 kcal per 100g, Carbohydrates: 25g, Fat: 1.5g, Protein: 1g, Sodium: 600mg",
    shelfLife: "10 months",
    rating: 4.6,
    reviews: 102,
    isBestseller: false,
    isNew: false,
  },
  {
    name: "Mix Pickle - 400g",
    brand: "Mom's Recipe",
    description: "Assorted vegetable pickle with mango, lemon, carrot, and other seasonal vegetables. A perfect blend of flavors in every bite.",
    price: 200,
    originalPrice: 240,
    category: "mixed",
    images: ["mixpickle.jpg"],
    inStock: true,
    weight: "400g",
    ingredients: "Mango, Lemon, Carrot, Cauliflower, Mustard Oil, Salt, Spices, Turmeric, Fenugreek",
    nutritionalInfo: "Energy: 50 kcal per 100g, Carbohydrates: 9g, Fat: 2g, Protein: 1.5g, Sodium: 850mg",
    shelfLife: "12 months",
    rating: 4.6,
    reviews: 95,
    isBestseller: false,
    isNew: false,
  }
];

// Function to upload image to Firebase Storage
async function uploadImageToStorage(imageName: string): Promise<string> {
  try {
    // Check if public/images directory exists
    const publicImagesPath = path.join(process.cwd(), 'public', 'images', imageName);
    
    if (!fs.existsSync(publicImagesPath)) {
      console.warn(`⚠️  Image not found: ${imageName}. Using placeholder.`);
      return '/images/placeholder.svg';
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(publicImagesPath);
    
    // Create a reference to the storage location
    const storageRef = ref(storage, `products/${imageName}`);
    
    // Upload the image
    const snapshot = await uploadBytes(storageRef, imageBuffer, {
      contentType: 'image/jpeg', // Adjust based on your image type
    });
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log(`✓ Uploaded image: ${imageName}`);
    
    return downloadURL;
  } catch (error) {
    console.error(`❌ Failed to upload image ${imageName}:`, error);
    return '/images/placeholder.svg';
  }
}

async function seedProducts() {
  console.log('🚀 Starting to seed products with images...');
  
  try {
    // Check if products already exist
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    if (!productsSnapshot.empty) {
      console.log('📦 Products already exist. Skipping seeding.');
      console.log(`📊 Found ${productsSnapshot.size} existing products.`);
      return;
    }

    console.log('📤 Uploading images and adding products...');

    // Add products with uploaded images
    for (const product of products) {
      console.log(`\n📝 Processing: ${product.name}`);
      
      // Upload images and get URLs
      const imageUrls: string[] = [];
      for (const imageName of product.images) {
        const imageUrl = await uploadImageToStorage(imageName);
        imageUrls.push(imageUrl);
      }

      // Add product to Firestore with image URLs
      const productData = {
        ...product,
        images: imageUrls,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log(`✅ Added: ${product.name} (ID: ${docRef.id})`);
      
      // Small delay to avoid overwhelming Firebase
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎉 Successfully seeded all products with images!');
    console.log(`📊 Total products added: ${products.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

// Run the seed function
seedProducts()
  .then(() => {
    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
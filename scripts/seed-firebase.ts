// scripts/seed-firebase.ts
// Run with: npx ts-node scripts/seed-firebase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  {
    name: "Mango Pickle (Punjabi Style) - 1kg",
    brand: "Mom's Recipe",
    description: "Authentic Punjabi style mango pickle with robust flavors and traditional spices. Perfect accompaniment to any meal with its tangy and spicy taste profile.",
    price: 475,
    originalPrice: 525,
    category: "mango",
    images: ["/images/mangopunjabi.jpg"],
    inStock: true,
    weight: "1kg",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Fennel, Nigella Seeds",
    nutritionalInfo: "Energy: 50 kcal per 100g, Carbohydrates: 9g, Fat: 2.5g, Protein: 1.2g, Sodium: 800mg",
    shelfLife: "12 months",
    rating: 4.7,
    reviews: 156,
    isBestseller: true,
    isNew: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mango Pickle (Punjabi Style) - 400g",
    brand: "Mom's Recipe",
    description: "Same great Punjabi style mango pickle in a convenient 400g pack.",
    price: 190,
    originalPrice: 220,
    category: "mango",
    images: ["/images/mangopunjabi.jpg"],
    inStock: true,
    weight: "400g",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Fennel, Nigella Seeds",
    nutritionalInfo: "Energy: 50 kcal per 100g, Carbohydrates: 9g, Fat: 2.5g, Protein: 1.2g, Sodium: 800mg",
    shelfLife: "12 months",
    rating: 4.6,
    reviews: 98,
    isBestseller: false,
    isNew: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mango Chatkara - 1kg",
    brand: "Mom's Recipe",
    description: "Special chatkara variety with extra tanginess and spice. Made from specially selected mangoes for that perfect balance of sour and spicy flavors.",
    price: 600,
    originalPrice: 650,
    category: "mango",
    images: ["/images/mangochatkara.jpg"],
    inStock: true,
    weight: "1kg",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Asafoetida, Mustard Seeds",
    nutritionalInfo: "Energy: 48 kcal per 100g, Carbohydrates: 8.5g, Fat: 2.2g, Protein: 1.1g, Sodium: 820mg",
    shelfLife: "12 months",
    rating: 4.9,
    reviews: 210,
    isBestseller: true,
    isNew: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mango Chatkara - 500g",
    brand: "Mom's Recipe",
    description: "The same delicious mango chatkara in a 500g pack.",
    price: 310,
    originalPrice: 350,
    category: "mango",
    images: ["/images/mangochatkara.jpg"],
    inStock: true,
    weight: "500g",
    ingredients: "Raw Mango, Mustard Oil, Salt, Red Chili Powder, Turmeric, Fenugreek, Asafoetida, Mustard Seeds",
    nutritionalInfo: "Energy: 48 kcal per 100g, Carbohydrates: 8.5g, Fat: 2.2g, Protein: 1.1g, Sodium: 820mg",
    shelfLife: "12 months",
    rating: 4.8,
    reviews: 145,
    isBestseller: false,
    isNew: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mirchi Pickle - 400g",
    brand: "Mom's Recipe",
    description: "Spicy green chili pickle that adds fire to your meals. Made from fresh green chilies and traditional spices for authentic flavor.",
    price: 250,
    originalPrice: 290,
    category: "chili",
    images: ["/images/mirch.jpg"],
    inStock: true,
    weight: "400g",
    ingredients: "Green Chilies, Mustard Oil, Salt, Turmeric, Fenugreek, Mustard Seeds, Asafoetida",
    nutritionalInfo: "Energy: 38 kcal per 100g, Carbohydrates: 6.5g, Fat: 1.8g, Protein: 1.3g, Sodium: 850mg",
    shelfLife: "12 months",
    rating: 4.5,
    reviews: 112,
    isBestseller: false,
    isNew: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Garlic Pickle - 400g",
    brand: "Mom's Recipe",
    description: "Flavorful garlic pickle with health benefits. Made from fresh garlic cloves marinated in spices and mustard oil.",
    price: 300,
    originalPrice: 350,
    category: "garlic",
    images: ["/images/garlic.jpg"],
    inStock: true,
    weight: "400g",
    ingredients: "Garlic, Mustard Oil, Salt, Red Chili Powder, Turmeric, Lemon Juice, Mustard Seeds",
    nutritionalInfo: "Energy: 55 kcal per 100g, Carbohydrates: 10g, Fat: 2g, Protein: 2g, Sodium: 780mg",
    shelfLife: "12 months",
    rating: 4.7,
    reviews: 134,
    isBestseller: false,
    isNew: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sweet Lemon Pickle - 500g",
    brand: "Mom's Recipe",
    description: "Sweet and tangy lemon pickle with a perfect balance of flavors. Great as a condiment or even as a spread.",
    price: 250,
    originalPrice: 280,
    category: "lemon",
    images: ["/images/sweetlemon.jpg"],
    inStock: true,
    weight: "500g",
    ingredients: "Lemon, Sugar, Salt, Red Chili Powder, Turmeric, Mustard Seeds, Fenugreek, Asafoetida",
    nutritionalInfo: "Energy: 120 kcal per 100g, Carbohydrates: 25g, Fat: 1.5g, Protein: 1g, Sodium: 600mg",
    shelfLife: "10 months",
    rating: 4.6,
    reviews: 102,
    isBestseller: false,
    isNew: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mix Pickle - 400g",
    brand: "Mom's Recipe",
    description: "Assorted vegetable pickle with mango, lemon, carrot, and other seasonal vegetables. A perfect blend of flavors in every bite.",
    price: 200,
    originalPrice: 240,
    category: "mixed",
    images: ["/images/mixpickle.jpg"],
    inStock: true,
    weight: "400g",
    ingredients: "Mango, Lemon, Carrot, Cauliflower, Mustard Oil, Salt, Spices, Turmeric, Fenugreek",
    nutritionalInfo: "Energy: 50 kcal per 100g, Carbohydrates: 9g, Fat: 2g, Protein: 1.5g, Sodium: 850mg",
    shelfLife: "12 months",
    rating: 4.6,
    reviews: 95,
    isBestseller: false,
    isNew: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedProducts() {
  console.log('Starting to seed products...');
  
  try {
    // Check if products already exist
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    if (!productsSnapshot.empty) {
      console.log('Products already exist. Skipping seeding.');
      console.log(`Found ${productsSnapshot.size} existing products.`);
      return;
    }

    // Add products
    for (const product of products) {
      const docRef = await addDoc(collection(db, 'products'), product);
      console.log(`✓ Added: ${product.name} (ID: ${docRef.id})`);
    }

    console.log('\n✅ Successfully seeded all products!');
    console.log(`Total products added: ${products.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

// Run the seed function
seedProducts()
  .then(() => {
    console.log('\n🎉 Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
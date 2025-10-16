// lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp, setDoc } from "firebase/firestore";
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Export the app instance
export default app;

// ===== TYPE DEFINITIONS =====
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
}

interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

interface ProductData {
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  images: string[];
  inStock: boolean;
  weight?: string;
  ingredients: string;
  nutritionalInfo?: string;
  shelfLife: string;
  rating: number;
  reviews: number;
  isBestseller: boolean;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductUpdateData {
  name?: string;
  brand?: string;
  description?: string;
  price?: number;
  originalPrice?: number | null;
  category?: string;
  images?: string[];
  inStock?: boolean;
  weight?: string;
  ingredients?: string;
  nutritionalInfo?: string;
  shelfLife?: string;
  rating?: number;
  reviews?: number;
  isBestseller?: boolean;
  isNew?: boolean;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight?: string;
}

interface OrderUser {
  uid: string;
  email: string | null;
  name: string | null;
  phone: string;
}

interface OrderData {
  user: OrderUser;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  shipping: number;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

interface ReviewData {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  userName: string;
}

// ===== AUTHENTICATION UTILITIES =====
export const authUtils = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  // Create new user
  signUp: async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  },

  // Update user profile
  updateUserProfile: async (user: User, profile: { displayName?: string; photoURL?: string }) => {
    return await updateProfile(user, profile);
  },

  // Sign out
  logout: async () => {
    return await signOut(auth);
  },

  // Auth state listener
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};

// ===== FIRESTORE SERVICES =====
export const firestoreService = {
  // User Services
  user: {
    async create(userId: string, userData: UserData) {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        uid: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return userId;
    },

    async get(userId: string) {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { uid: userSnap.id, ...userSnap.data() };
      }
      return null;
    },

    async update(userId: string, data: UserUpdateData) {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    }
  },

  // Product Services
  products: {
    async getAll() {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },

    async getById(productId: string) {
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        return { id: productSnap.id, ...productSnap.data() };
      }
      return null;
    },

    async getByCategory(category: string) {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('category', '==', category));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },

    async getBestsellers() {
      const productsRef = collection(db, 'products');
      const q = query(
        productsRef,
        where('isBestseller', '==', true),
        limit(8)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },

    async create(productData: ProductData) {
      const productsRef = collection(db, 'products');
      const docRef = await addDoc(productsRef, {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    },

    async update(productId: string, data: ProductUpdateData) {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    },

    async delete(productId: string) {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
    }
  },

  // Order Services
  orders: {
    async create(orderData: OrderData) {
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    },

    async getById(orderId: string) {
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (orderSnap.exists()) {
        return { id: orderSnap.id, ...orderSnap.data() };
      }
      return null;
    },

    async getByUserId(userId: string) {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('user.uid', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },

    async updateStatus(orderId: string, status: string) {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp()
      });
    }
  },

  // Review Services
  reviews: {
    async create(reviewData: ReviewData) {
      const reviewsRef = collection(db, 'reviews');
      const docRef = await addDoc(reviewsRef, {
        ...reviewData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    },

    async getByProductId(productId: string) {
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },

    async delete(reviewId: string) {
      const reviewRef = doc(db, 'reviews', reviewId);
      await deleteDoc(reviewRef);
    }
  },

  // Newsletter Services
  newsletter: {
    async subscribe(email: string) {
      const newsletterRef = collection(db, 'newsletter');
      const q = query(newsletterRef, where('email', '==', email));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        await addDoc(newsletterRef, {
          email,
          subscribedAt: serverTimestamp()
        });
        return true;
      }
      return false; // Already subscribed
    }
  }
};

// ===== STORAGE UTILITIES =====
export const storageUtils = {
  // Upload product image
  async uploadProductImage(file: File, productId: string): Promise<string> {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${productId}-${Date.now()}.${fileExtension}`;
      
      const storageRef = ref(storage, `products/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Upload multiple images
  async uploadMultipleImages(files: File[], productId: string): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadProductImage(file, productId));
    return Promise.all(uploadPromises);
  }
};

// ===== DATABASE UTILITIES =====
export const dbUtils = {
  // Check if collection exists and has documents
  async collectionExists(collectionName: string): Promise<boolean> {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      return !snapshot.empty;
    } catch (error) {
      console.error(`Error checking collection ${collectionName}:`, error);
      return false;
    }
  },

  // Get document count in a collection
  async getDocumentCount(collectionName: string): Promise<number> {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      return snapshot.size;
    } catch (error) {
      console.error(`Error getting document count for ${collectionName}:`, error);
      return 0;
    }
  }
};
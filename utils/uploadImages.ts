// utils/uploadImages.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  try {
    // Create a unique file name
    const fileExtension = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}.${fileExtension}`;
    
    // Create a reference to the storage location
    const storageRef = ref(storage, `products/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function uploadMultipleImages(files: File[], productId: string): Promise<string[]> {
  const uploadPromises = files.map(file => uploadProductImage(file, productId));
  return Promise.all(uploadPromises);
}
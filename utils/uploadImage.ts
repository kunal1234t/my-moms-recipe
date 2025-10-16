// utils/uploadImages.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    // Create a storage reference
    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  });

  return Promise.all(uploadPromises);
};

export const uploadSingleImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
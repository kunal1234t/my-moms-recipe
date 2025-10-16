// types/index.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  originalPrice?: number;
  weight?: string; // Add this line
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: string;
  isBestseller?: boolean;
  weight?: string; // Add this line if products have weight
  inStock: boolean;
}
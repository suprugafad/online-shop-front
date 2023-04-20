export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  amount: number;
  mainImage: string;
  mainImageUrl: string;
  additionalImages: string[];
  categories: number[] | null;
}
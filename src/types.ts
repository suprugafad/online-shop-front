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

export interface Filters {
  categories: string[];
  manufacturers: string[];
  priceRange: number[];
}

export interface ProductCard {
  id: number,
  title: string,
  price: string,
  mainImage: string,
}

export interface ICartItem {
  id: number;
  product: ProductCard;
  quantity: number;
}

export interface IAddressForSelect {
  id: number;
  addressValue: string;
}

export interface IAddress {
  country: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
}

export interface IUser {
  id: number,
  username: string,
  email: string,
  role: string,
}

interface IOrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  id: number;
  status: string;
  createdAt: string;
  totalPrice: number;
  products: IOrderItem[];
}

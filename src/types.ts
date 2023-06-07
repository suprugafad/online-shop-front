export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  title: string;
  manufacturer: string;
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

export interface IOrderItem {
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

export interface IOrderTable {
  id: number;
  userId: number;
  userEmail: string;
  createdAt: string;
  comment: string;
  totalPrice: number;
  status: string;
  products: IOrderItem[];
  address: string;
  paymentMethod: string;
  paymentStatus: string;
}

export interface IReview {
  id: number;
  userId: number;
  productId: number;
  comment: string;
  rating: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'PENDING',
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
}

export interface IMonthlySales {
  month: string,
  total_sales: string
}

import { Category } from './category';
import { Review } from './review';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  category: string | Category;
  stock: number;
  sold: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  averageRating: number;
  reviewCount: number;
  reviews: Review[];
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

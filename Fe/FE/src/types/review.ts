import { User } from './user';
import { Product } from './product';

export interface Review {
  _id: string;
  user: string | User;
  product: string | Product;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  reviews: Review[];
  total: number;
  averageRating: number;
} 
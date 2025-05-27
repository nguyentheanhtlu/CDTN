import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  voucher?: {
    type: 'discount' | 'free_shipping';
    value: number;
  };
} 
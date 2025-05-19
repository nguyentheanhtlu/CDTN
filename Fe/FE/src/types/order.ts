import { Address } from './address';
import { Product } from './product';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: 'COD' | 'VNPay' | 'MoMo';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  voucher?: {
    type: 'discount' | 'free_shipping';
    value: number;
  };
  createdAt: string;
  updatedAt: string;
} 
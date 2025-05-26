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
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  shippingAddress: Address;
  paymentMethod: 'COD' | 'VNPay' | 'MoMo';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  appliedVouchers: {
    type: 'discount' | 'free_shipping';
    value: number;
    discountAmount: number;
    message?: string;
  }[];
  createdAt: string;
  updatedAt: string;
} 
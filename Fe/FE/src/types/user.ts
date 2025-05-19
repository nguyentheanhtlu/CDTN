import { Address } from './address';
import { Voucher } from './voucher';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  addresses: Address[];
  vouchers: Voucher[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
} 
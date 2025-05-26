export interface Voucher {
  _id: string;
  type: 'discount' | 'free_shipping';
  value: number;
  status: 'active' | 'used' | 'expired';
  expiredAt?: string;
  createdAt?: string;
  updatedAt?: string;
} 
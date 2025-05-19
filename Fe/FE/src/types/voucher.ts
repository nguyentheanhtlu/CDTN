export interface Voucher {
  _id: string;
  type: 'discount' | 'free_shipping';
  value: number;
  expiredAt?: string;
  isUsed: boolean;
  usedAt?: string;
  createdAt: string;
} 
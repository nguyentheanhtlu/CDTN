export interface Address {
  _id?: string;
  name: string;
  phone: string;
  addressLine: string;
  ward: string;
  district: string;
  province: string;
  isDefault?: boolean;
} 
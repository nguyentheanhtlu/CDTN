export interface Customer {
  _id: string;
  fullName: string;
  avatar: string;
  email: string;
  createdAt: string;
  status?: string;
  addresses?: any
}
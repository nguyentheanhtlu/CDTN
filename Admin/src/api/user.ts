import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  vipLevel: number;
  vipRank: string;
  totalSpent: number;
  createdAt: string;
  addresses: {
    _id: string;
    name: string;
    phone: string;
    addressLine: string;
    ward: string;
    district: string;
    province: string;
    isDefault: boolean;
  }[];
  vouchers: {
    _id: string;
    type: 'discount' | 'free_shipping';
    value: number;
    status: 'active' | 'used' | 'expired';
    expiredAt: string;
  }[];
}

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users/admin/all-users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data.users;
};

// Get user by ID
export const getUserById = async (userId: string): Promise<{ user: User }> => {
  const response = await axios.get(`${API_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Delete user
export const deleteUser = async (userId: string): Promise<void> => {
  await axios.delete(`${API_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

// Update user status
export const updateUserStatus = async (userId: string, status: 'Active' | 'Inactive'): Promise<void> => {
  await axios.put(`${API_URL}/users/${userId}/status`, 
    { status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
};

export const addVoucherToUser = async (userId: string, voucher: { type: 'discount' | 'free_shipping'; value: number; expiredAt: string }): Promise<void> => {
  await axios.post(`${API_URL}/users/${userId}/voucher`, voucher, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const removeVoucherFromUser = async (userId: string, voucherId: string): Promise<void> => {
  await axios.delete(`${API_URL}/users/${userId}/voucher/${voucherId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const deleteUserAddress = async (addressId: string): Promise<void> => {
  await axios.delete(`${API_URL}/users/addresses/${addressId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const setDefaultAddress = async (addressId: string): Promise<void> => {
  await axios.put(`${API_URL}/users/addresses/${addressId}/default`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};
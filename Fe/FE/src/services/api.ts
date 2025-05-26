import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Hàm lấy header với token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found in localStorage');
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

// Tạo instance axios với interceptor
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để tự động thêm token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Thêm interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

interface AddressData {
  name: string;
  phone: string;
  addressLine: string;
  ward: string;
  district: string;
  province: string;
  isDefault?: boolean;
}

const apiService = {
  // Auth APIs
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },

  // User APIs
  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: { firstName: string; lastName: string; phone: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  updatePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const response = await api.put('/users/password', data);
    return response.data;
  },

  // Address APIs
  getAddresses: async () => {
    try {
      const response = await api.get('/users/addresses');
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },

  addAddress: async (data: AddressData) => {
    const response = await api.post('/users/addresses', data);
    return response.data;
  },

  updateAddress: async (id: string, data: AddressData) => {
    const response = await api.put(`/users/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: string) => {
    const response = await api.delete(`/users/addresses/${id}`);
    return response.data;
  },

  setDefaultAddress: async (addressId: string) => {
    const response = await api.put(`/users/addresses/${addressId}/default`);
    return response.data;
  },

  // Order APIs
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getOrderDetails: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  cancelOrder: async (orderId: string) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Chat APIs
  getChatHistory: async (userId: string, adminId: string) => {
    const response = await api.get(`/chat/history/${userId}/${adminId}`);
    return response.data;
  },

  getUnreadCount: async (userId: string) => {
    const response = await api.get(`/chat/unread/${userId}`);
    return response.data;
  },

  sendMessage: async (senderId: string, receiverId: string, content: string) => {
    const response = await api.post('/chat/message', {
      senderId,
      receiverId,
      content
    });
    return response.data;
  }
};

export default apiService; 
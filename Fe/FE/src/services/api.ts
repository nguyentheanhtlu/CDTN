import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Hàm lấy header với token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
    const response = await axios.post(`${API_URL}/auth/login`, data);
    // Lưu token sau khi đăng nhập thành công
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(`${API_URL}/auth/logout`, {}, { headers: getAuthHeader() });
    // Xóa token khi đăng xuất
    localStorage.removeItem('token');
    return response.data;
  },

  // User APIs
  getUserProfile: async () => {
    const response = await axios.get(`${API_URL}/users/profile`, { headers: getAuthHeader() });
    return response.data;
  },

  updateProfile: async (data: { firstName: string; lastName: string; phone: string }) => {
    const response = await axios.put(`${API_URL}/users/profile`, data, { headers: getAuthHeader() });
    return response.data;
  },

  updatePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const response = await axios.put(`${API_URL}/users/password`, data, { headers: getAuthHeader() });
    return response.data;
  },

  // Address APIs
  getAddresses: async () => {
    const response = await axios.get(`${API_URL}/users/addresses`, { headers: getAuthHeader() });
    return response.data;
  },

  addAddress: async (data: AddressData) => {
    const response = await axios.post(`${API_URL}/users/addresses`, data, { headers: getAuthHeader() });
    return response.data;
  },

  updateAddress: async (id: string, data: AddressData) => {
    const response = await axios.put(`${API_URL}/users/addresses/${id}`, data, { headers: getAuthHeader() });
    return response.data;
  },

  deleteAddress: async (id: string) => {
    const response = await axios.delete(`${API_URL}/users/addresses/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  // Order APIs
  getMyOrders: async () => {
    const response = await axios.get(`${API_URL}/orders/my-orders`, { headers: getAuthHeader() });
    return response.data;
  },

  getOrderDetails: async (orderId: string) => {
    const response = await axios.get(`${API_URL}/orders/${orderId}`, { headers: getAuthHeader() });
    return response.data;
  },

  cancelOrder: async (orderId: string) => {
    const response = await axios.put(`${API_URL}/orders/${orderId}/cancel`, {}, { headers: getAuthHeader() });
    return response.data;
  }
};

export { apiService }; 
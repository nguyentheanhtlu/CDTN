import axios, { AxiosError } from 'axios';

// Get API URL from environment variable or fallback to default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface Product {
  _id: string;
  name: string;
  title: string; // For display purposes
  description: string;
  price: number;
  discountedPrice: number; // For display purposes
  discount: number;
  images: {
    thumbnails: string[];
    previews: string[];
  };
  category: string;
  stock: number;
  sold: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  averageRating: number;
  reviewCount: number;
  reviews: number; // For display purposes
}

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  // Add other order fields as needed
}

// API Service
const apiService = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Cart
  getCart: async (): Promise<Cart> => {
    try {
      const response = await axiosInstance.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  addToCart: async (productId: string, quantity: number): Promise<Cart> => {
    try {
      const response = await axiosInstance.post('/cart/add', {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  removeFromCart: async (productId: string): Promise<Cart> => {
    try {
      const response = await axiosInstance.delete(`/cart/${productId}`);
      return response.data.cart;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  },

  // Orders
  getMyOrders: async (): Promise<Order[]> => {
    try {
      const response = await axiosInstance.get('/orders/my-orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  createOrder: async (): Promise<Order> => {
    try {
      const response = await axiosInstance.post('/orders');
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Auth
  login: async (email: string, password: string): Promise<{ token: string }> => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      const { token } = response.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
};

export default apiService; 
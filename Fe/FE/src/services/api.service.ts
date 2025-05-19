import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { Product, ProductResponse } from '@/types/product';
import { Category } from '@/types/category';
import { Order } from '@/types/order';
import { User } from '@/types/user';
import { Blog } from '@/types/blog';
import { Cart } from '@/types/cart';
import { Review, ReviewResponse } from '@/types/review';
import { Voucher } from '@/types/voucher';
import { Address } from '@/types/address';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log('Current token:', token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Request headers:', config.headers);
        }
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('API Error:', error.response || error);
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
  }

  // Auth APIs
  async register(data: { email: string; password: string; fullName: string; phone?: string; address?: string }) {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.api.post('/auth/login', data);
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async verifyEmail(data: { userId: string; code: string }) {
    const response = await this.api.post('/auth/verify-email', data);
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Product APIs
  async getProducts(params?: { 
    category?: string; 
    search?: string; 
    sort?: 'price-asc' | 'price-desc' | 'popular';
    page?: number;
    limit?: number;
  }) {
    const response = await this.api.get<ProductResponse>('/products', { params });
    return response.data;
  }

  async getProductById(id: string) {
    const response = await this.api.get<Product>(`/products/${id}`);
    return response.data;
  }

  async createProduct(data: FormData) {
    const response = await this.api.post<{ message: string; product: Product }>('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateProduct(id: string, data: FormData) {
    const response = await this.api.put<{ message: string; product: Product }>(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async deleteProduct(id: string) {
    const response = await this.api.delete<{ message: string }>(`/products/${id}`);
    return response.data;
  }

  async reviewProduct(productId: string, data: { rating: number; comment: string }) {
    const response = await this.api.post<{ message: string; product: Product }>(`/products/${productId}/review`, data);
    return response.data;
  }

  async updateReview(productId: string, data: { rating: number; comment: string }) {
    const response = await this.api.put<{ message: string; product: Product }>(`/products/${productId}/review`, data);
    return response.data;
  }

  async deleteReview(productId: string) {
    const response = await this.api.delete<{ message: string; product: Product }>(`/products/${productId}/review`);
    return response.data;
  }

  async getProductReviews(productId: string, params?: { rating?: number }) {
    const response = await this.api.get<ReviewResponse>(`/products/${productId}/reviews`, { params });
    return response.data;
  }

  // Category APIs
  async getCategories() {
    const response = await this.api.get<Category[]>('/category');
    return response.data;
  }

  async createCategory(data: { name: string; description?: string }) {
    const response = await this.api.post<{ message: string; category: Category }>('/category', data);
    return response.data;
  }

  async updateCategory(id: string, data: { name: string; description?: string }) {
    const response = await this.api.put<{ message: string; category: Category }>(`/category/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string) {
    const response = await this.api.delete<{ message: string }>(`/category/${id}`);
    return response.data;
  }

  // Cart APIs
  async getCart() {
    const response = await this.api.get<Cart>('/cart');
    return response.data;
  }

  async addToCart(data: { productId: string; quantity: number }) {
    const response = await this.api.post<{ message: string; cart: Cart }>('/cart/add', data);
    return response.data;
  }

  async updateCartItem(data: { productId: string; quantity: number }) {
    const response = await this.api.put<{ message: string; cart: Cart }>('/cart/update', data);
    return response.data;
  }

  async removeFromCart(productId: string) {
    const response = await this.api.delete<{ message: string; cart: Cart }>(`/cart/${productId}`);
    return response.data;
  }

  // Order APIs
  async createOrder(data: { shippingAddress: Address; paymentMethod: 'COD' | 'VNPay' | 'MoMo' }) {
    const response = await this.api.post<{ order: Order; paymentUrl?: string }>('/orders', data);
    return response.data;
  }

  async getMyOrders() {
    const response = await this.api.get<Order[]>('/orders/user');
    return response.data;
  }

  async getAllOrders(params?: { status?: string; page?: number; limit?: number }) {
    const response = await this.api.get<{ orders: Order[]; total: number; page: number; totalPages: number }>('/orders', { params });
    return response.data;
  }

  async getOrderById(id: string) {
    const response = await this.api.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async updateOrderStatus(id: string, data: { orderStatus: string }) {
    const response = await this.api.put<{ message: string; order: Order; voucherDetail?: any }>(`/orders/${id}/status`, data);
    return response.data;
  }

  // User APIs
  async getProfile() {
    const response = await this.api.get<User>('/users/profile');
    return response.data;
  }

  async updateProfile(data: { fullName?: string; phone?: string; address?: string }) {
    const response = await this.api.put<User>('/users/profile', data);
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await this.api.put<{ message: string }>('/users/change-password', data);
    return response.data;
  }

  async updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await this.api.put<User>('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async getVouchers() {
    const response = await this.api.get<Voucher[]>('/users/vouchers');
    return response.data;
  }

  async getVoucherHistory() {
    const response = await this.api.get<any[]>('/users/voucher-history');
    return response.data;
  }

  async grantVoucher(userId: string, data: { type: 'discount' | 'free_shipping'; value: number; expiredAt?: Date }) {
    const response = await this.api.post<{ message: string; vouchers: Voucher[] }>(`/users/vouchers/grant/${userId}`, data);
    return response.data;
  }

  async removeVoucher(voucherId: string) {
    const response = await this.api.delete<{ message: string }>(`/users/vouchers/${voucherId}`);
    return response.data;
  }

  async getAddresses() {
    const response = await this.api.get<Address[]>('/users/addresses');
    return response.data;
  }

  async addAddress(data: Address) {
    const response = await this.api.post<{ message: string; addresses: Address[] }>('/users/addresses', data);
    return response.data;
  }

  async updateAddress(index: number, data: Address) {
    const response = await this.api.put<{ message: string; addresses: Address[] }>(`/users/addresses/${index}`, data);
    return response.data;
  }

  async deleteAddress(index: number) {
    const response = await this.api.delete<{ message: string; addresses: Address[] }>(`/users/addresses/${index}`);
    return response.data;
  }

  async setDefaultAddress(index: number) {
    const response = await this.api.put<{ message: string; addresses: Address[] }>(`/users/addresses/${index}/default`);
    return response.data;
  }

  // Payment APIs
  async payWithVNPay(data: { amount: number; orderId: string }) {
    const response = await this.api.post<{ paymentUrl: string }>('/payments/vnpay', data);
    return response.data;
  }

  async payWithMoMo(data: { amount: number }) {
    const response = await this.api.post<{ paymentUrl: string }>('/payments/momo', data);
    return response.data;
  }

  // Blog APIs
  async getBlogs(params?: { page?: number; limit?: number; status?: string }) {
    const response = await this.api.get<{ blogs: Blog[]; totalPages: number; currentPage: number }>('/blogs', { params });
    return response.data;
  }

  async getBlogById(id: string) {
    const response = await this.api.get<Blog>(`/blogs/${id}`);
    return response.data;
  }

  async createBlog(data: FormData) {
    const response = await this.api.post<Blog>('/blogs', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateBlog(id: string, data: FormData) {
    const response = await this.api.put<Blog>(`/blogs/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async deleteBlog(id: string) {
    const response = await this.api.delete<{ message: string }>(`/blogs/${id}`);
    return response.data;
  }

  // Upload APIs
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await this.api.post<{ message: string; url: string }>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async uploadMultipleImages(files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const response = await this.api.post<{ message: string; urls: string[] }>('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async deleteImage(url: string) {
    const response = await this.api.delete<{ message: string }>('/upload/image', { data: { url } });
    return response.data;
  }

  // Chat APIs
  async getChatHistory(userId: string, adminId: string) {
    const response = await this.api.get<any[]>(`/chat/history/${userId}/${adminId}`);
    return response.data;
  }

  async getUnreadCount(userId: string) {
    const response = await this.api.get<{ unreadCount: number }>(`/chat/unread/${userId}`);
    return response.data;
  }

  // Chatbot APIs
  async chatWithGemini(message: string) {
    const response = await this.api.post<{ reply: string }>('/chatbot/gemini', { message });
    return response.data;
  }
}

export const apiService = new ApiService(); 
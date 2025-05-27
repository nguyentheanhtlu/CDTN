export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  ENDPOINTS: {
    // Auth
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
    },
    // Products
    PRODUCTS: {
      LIST: '/products',
      DETAIL: (id: string) => `/products/${id}`,
    },
    // Categories
    CATEGORIES: {
      LIST: '/category',
    },
    // Cart
    CART: {
      LIST: '/cart',
      ADD: '/cart',
      UPDATE: (id: string) => `/cart/${id}`,
      DELETE: (id: string) => `/cart/${id}`,
    },
    // Orders
    ORDERS: {
      MY_ORDERS: '/orders/my-orders',
      LIST: '/orders',
    },
    // User
    USER: {
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
      CHANGE_PASSWORD: '/users/change-password',
    },
    // Blogs
    BLOGS: {
      LIST: '/blogs',
      DETAIL: (id: string) => `/blogs/${id}`,
    },
    // Upload
    UPLOAD: {
      IMAGE: '/upload/upload',
    },
  },
}; 
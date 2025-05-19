import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ApiProducts = {
  getAllProducts: async () => {
    return await axios.get(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  createProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images?: (string | File)[];
  }) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('category', productData.category);
    formData.append('stock', productData.stock.toString());
    
    if (productData.images) {
      productData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    return await axios.post(`${API_URL}/products`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updateProduct: async (id: string, productData: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    stock?: number;
    images?: (string | File)[];
  }) => {
    const formData = new FormData();
    
    if (productData.name) formData.append('name', productData.name);
    if (productData.description) formData.append('description', productData.description);
    if (productData.price) formData.append('price', productData.price.toString());
    if (productData.category) formData.append('category', productData.category);
    if (productData.stock) formData.append('stock', productData.stock.toString());
    
    if (productData.images) {
      productData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    return await axios.put(`${API_URL}/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deleteProduct: async (id: string) => {
    return await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
};

export default ApiProducts;

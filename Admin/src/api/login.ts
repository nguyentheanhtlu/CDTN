import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; 

const ApiSignIn = {
  login: async (email: string, password: string) => {
    return await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
  },
  register: async (email: string, password: string, fullName: string) => {
    return await axios.post(`${API_URL}/register`, {
      email,
      password,
      fullName
    });
  },
  verifyEmail: async (userId: string, code: string) => {
    return await axios.post(`${API_URL}/verify-email`, {
      userId,
      code
    });
  },
  getUserInfo: async () => {
    return await axios.get(`http://localhost:5000/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
};

export default ApiSignIn;
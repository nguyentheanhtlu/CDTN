import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export async function login({ email, password }: { email: string; password: string }) {
  return await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
}

export async function register({ email, password, fullName }: { email: string; password: string; fullName: string }) {
  return await axios.post(`${API_URL}/register`, {
    email,
    password,
    fullName
  });
}

export async function verifyEmail(userId: string, code: string) {
  return await axios.post(`${API_URL}/verify-email`, {
    userId,
    code
  });
}

export async function getUserInfo() {
  return await axios.get(`http://localhost:5000/api/users/profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('avatar', file);
  return await axios.put('http://localhost:5000/api/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}
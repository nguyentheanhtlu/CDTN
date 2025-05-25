import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const ApiCustomer = {
  getCustomers: async () => {
    const res =  await axios.get(`${API_URL}/accounts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return res.data
  }
};

export default ApiCustomer;
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ApiCategories = {
  getAllCategories: async () => {
    return await axios.get(`${API_URL}/category`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
};

export default ApiCategories; 

import axios, { AxiosRequestConfig } from "axios";

const API_URL = 'http://localhost:5000/api';

class ApiService {
  axiosInstance = axios.create({
    baseURL: API_URL,
  });
  auth = {
    accessToken: '',
    refreshToken: '',
  }

  constructor() {
    this.auth.accessToken = localStorage.getItem('token') || ''
  }

  async callApi(method: string, endpoint: string, data: any = {}, config?: AxiosRequestConfig) {
    try {
      const r = await this.axiosInstance({
        method,
        url: endpoint,
        data,
        headers: {
          Authorization: this.auth.accessToken ? `Bearer ${this.auth.accessToken}` : undefined,
        },
        ...config,
      });
      return r.data;
    } catch (e: any) {
      if (e.response) {
        if (e.response.data) throw e.response.data;
        throw e.response;
      } else {
        throw e;
      }
    }
  }
}

export default new ApiService()
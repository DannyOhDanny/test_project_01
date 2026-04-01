import axios from 'axios';
import { API_CONFIG, PRODUCT_API_CONFIG } from '../config/api.config';

export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosProductInstance = axios.create({
  baseURL: PRODUCT_API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      error.userMessage = error.response.data.message;
    } else if (error.message) {
      error.userMessage = error.message;
    } else {
      error.userMessage = 'Произошла неизвестная ошибка';
    }
    return Promise.reject(error);
  }
);

axiosProductInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      error.userMessage = error.response.data.message;
    } else if (error.message) {
      error.userMessage = error.message;
    } else {
      error.userMessage = 'Произошла ошибка загрузки товаров';
    }
    return Promise.reject(error);
  }
);

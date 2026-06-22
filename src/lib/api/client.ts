import axios from 'axios';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/users/me') || error.config?.url?.includes('/auth/');
    
    if (error.response?.status === 401) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      if (!isAuthEndpoint) {
        toast.error('Session expired. Please log in again. / Сессия истекла.');
        window.location.href = '/login';
      }
    } else if (error.response?.status !== 404 && error.response?.status !== 401) {
      // Show toast for other server errors, except 404
      const message = error.response?.data?.message || 'Something went wrong / Произошла ошибка';
      if (!isAuthEndpoint) {
         toast.error(message);
      }
    }
    
    return Promise.reject(error);
  }
);

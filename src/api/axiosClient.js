import axios from 'axios';
import { getToken, registerAndLogin } from './authService';

const axiosClient = axios.create({
  baseURL: import.meta.env.PROD ? 'https://worldcup26.ir' : '/api',
});

// Request interceptor: agrega JWT token a cada petición
axiosClient.interceptors.request.use(async (config) => {
  // No agregar token a rutas de auth
  if (config.url.includes('/auth/')) return config;

  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: manejo de errores y token expirado
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Si el token expiró (401), intentar re-login una vez
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await registerAndLogin();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (authError) {
        console.error('Re-auth failed:', authError);
        return Promise.reject(authError);
      }
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;

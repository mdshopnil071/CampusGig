import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://campusgig-backend.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiration & Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/api/auth/')) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {
            refresh_token: refreshToken,
          });

          if (res.data?.access_token) {
            localStorage.setItem('access_token', res.data.access_token);
            if (res.data.refresh_token) {
              localStorage.setItem('refresh_token', res.data.refresh_token);
            }

            originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          // Token refresh failed - clean storage and emit logout event
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth:logout'));
          return Promise.reject(refreshErr);
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

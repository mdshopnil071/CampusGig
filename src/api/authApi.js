import apiClient from './client';

export const authApi = {
  signup: async (userData) => {
    // userData: { email, full_name, password, university_name }
    const response = await apiClient.post('/api/auth/signup', userData);
    return response.data;
  },

  login: async (email, password) => {
    // FastAPI OAuth2PasswordRequestForm expects URLSearchParams with 'username' and 'password'
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data; // { access_token, refresh_token, token_type }
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/api/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/api/auth/forgot-password', { email });
    return response.data; // { message, reset_token }
  },

  resetPassword: async (resetToken, newPassword) => {
    const response = await apiClient.post('/api/auth/reset-password', {
      reset_token: resetToken,
      new_password: newPassword,
    });
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    }
  },
};

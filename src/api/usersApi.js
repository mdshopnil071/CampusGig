import apiClient from './client';

export const usersApi = {
  getMe: async () => {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  },

  updateMe: async (userData) => {
    // userData: { full_name, university_name }
    const response = await apiClient.put('/api/users/me', userData);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },

  listUsers: async (params = {}) => {
    // params: { search, page, size }
    const response = await apiClient.get('/api/users', { params });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  },
};

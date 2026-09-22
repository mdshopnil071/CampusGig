import apiClient from './client';
import { DEFAULT_CAMPUS_CATEGORIES } from '../data/categoriesData';

export const categoriesApi = {
  getCategories: async (params = {}) => {
    // params: { page, size }
    try {
      const response = await apiClient.get('/api/categories', { params });
      const data = response.data;
      const list = Array.isArray(data) ? data : (data?.items || []);
      if (list && list.length > 0) {
        return list;
      }
      return DEFAULT_CAMPUS_CATEGORIES;
    } catch (err) {
      console.warn('Failed to load categories from backend, using default categories:', err);
      return DEFAULT_CAMPUS_CATEGORIES;
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`/api/categories/${id}`);
      return response.data;
    } catch (err) {
      const fallback = DEFAULT_CAMPUS_CATEGORIES.find((c) => c.id === Number(id));
      if (fallback) return fallback;
      throw err;
    }
  },

  createCategory: async (categoryData) => {
    // categoryData: { name, description }
    const response = await apiClient.post('/api/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await apiClient.put(`/api/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/api/categories/${id}`);
    return response.data;
  },
};

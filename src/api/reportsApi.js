import apiClient from './client';

export const reportsApi = {
  createReport: async (reportData) => {
    // reportData: { reason, details, reported_user_id }
    const response = await apiClient.post('/api/reports', reportData);
    return response.data;
  },

  getAdminReports: async (params = {}) => {
    // params: { status_filter, created_from, created_to, page, size }
    const response = await apiClient.get('/api/reports/admin', { params });
    return response.data;
  },

  updateReportStatus: async (id, status) => {
    // status: 'pending' | 'resolved' | 'dismissed'
    const response = await apiClient.put(`/api/reports/${id}`, { status });
    return response.data;
  },

  getReportById: async (id) => {
    const response = await apiClient.get(`/api/reports/${id}`);
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await apiClient.delete(`/api/reports/${id}`);
    return response.data;
  },
};

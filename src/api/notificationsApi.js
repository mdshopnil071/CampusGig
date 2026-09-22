import apiClient from './client';

export const notificationsApi = {
  getNotifications: async (params = {}) => {
    // params: { unread_only, page, size }
    const response = await apiClient.get('/api/notifications', { params });
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await apiClient.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    try {
      const response = await apiClient.put('/api/notifications/read-all');
      return response.data;
    } catch {
      // Graceful fallback while deployment finishes: mark each unread item
      const list = await apiClient.get('/api/notifications', { params: { unread_only: true, size: 50 } });
      if (Array.isArray(list.data)) {
        await Promise.allSettled(list.data.map((n) => apiClient.put(`/api/notifications/${n.id}/read`)));
      }
      return { success: true };
    }
  },

  createNotification: async (data) => {
    // data: { user_id, title, message }
    const response = await apiClient.post('/api/notifications', data);
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await apiClient.delete(`/api/notifications/${id}`);
    return response.data;
  },
};

import apiClient from './client';

export const messagesApi = {
  getOrderMessages: async (orderId, params = {}) => {
    // params: { page, size }
    const response = await apiClient.get(`/api/messages/order/${orderId}`, { params });
    return response.data;
  },

  sendMessage: async (orderId, text) => {
    const response = await apiClient.post('/api/messages', {
      order_id: orderId,
      text,
    });
    return response.data;
  },

  updateMessage: async (id, text) => {
    const response = await apiClient.put(`/api/messages/${id}`, { text });
    return response.data;
  },

  deleteMessage: async (id) => {
    const response = await apiClient.delete(`/api/messages/${id}`);
    return response.data;
  },
};

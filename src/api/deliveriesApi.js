import apiClient from './client';

export const deliveriesApi = {
  createDelivery: async (deliveryData) => {
    // deliveryData: { order_id, submission_text, file_url }
    const response = await apiClient.post('/api/deliveries', deliveryData);
    return response.data;
  },

  getDeliveriesByOrder: async (orderId, params = {}) => {
    // params: { page, size }
    const response = await apiClient.get(`/api/deliveries/order/${orderId}`, { params });
    return response.data;
  },

  updateDelivery: async (id, deliveryData) => {
    const response = await apiClient.put(`/api/deliveries/${id}`, deliveryData);
    return response.data;
  },

  deleteDelivery: async (id) => {
    const response = await apiClient.delete(`/api/deliveries/${id}`);
    return response.data;
  },
};

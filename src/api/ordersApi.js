import apiClient from './client';

export const ordersApi = {
  getOrders: async (params = {}) => {
    // params: { status_filter, created_from, created_to, page, size }
    const response = await apiClient.get('/api/orders', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    // orderData: { gig_id, seller_id, amount }
    const response = await apiClient.post('/api/orders', orderData);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    // status: 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled'
    const response = await apiClient.put(`/api/orders/${id}/status`, { status });
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await apiClient.delete(`/api/orders/${id}`);
    return response.data;
  },
};

import apiClient from './client';

export const reviewsApi = {
  createReview: async (reviewData) => {
    // reviewData: { order_id, seller_id, rating, comment }
    const response = await apiClient.post('/api/reviews', reviewData);
    return response.data;
  },

  getSellerReviews: async (sellerId, params = {}) => {
    // params: { page, size }
    const response = await apiClient.get(`/api/reviews/seller/${sellerId}`, { params });
    return response.data;
  },

  getReviewById: async (id) => {
    const response = await apiClient.get(`/api/reviews/${id}`);
    return response.data;
  },

  updateReview: async (id, reviewData) => {
    const response = await apiClient.put(`/api/reviews/${id}`, reviewData);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await apiClient.delete(`/api/reviews/${id}`);
    return response.data;
  },
};

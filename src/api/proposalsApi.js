import apiClient from './client';

export const proposalsApi = {
  createProposal: async (proposalData) => {
    // proposalData: { task_id, cover_letter, bid_amount }
    const response = await apiClient.post('/api/proposals', proposalData);
    return response.data;
  },

  getMyProposals: async (params = {}) => {
    // params: { status_filter, created_from, created_to, page, size }
    const response = await apiClient.get('/api/proposals/my', { params });
    return response.data;
  },

  getProposalById: async (id) => {
    const response = await apiClient.get(`/api/proposals/${id}`);
    return response.data;
  },

  updateProposal: async (id, proposalData) => {
    // proposalData: { cover_letter, bid_amount, status }
    const response = await apiClient.put(`/api/proposals/${id}`, proposalData);
    return response.data;
  },

  deleteProposal: async (id) => {
    const response = await apiClient.delete(`/api/proposals/${id}`);
    return response.data;
  },
};

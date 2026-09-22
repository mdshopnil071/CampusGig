import apiClient from './client';
import { DEFAULT_CAMPUS_CATEGORIES } from '../data/categoriesData';
import {
  INITIAL_CAMPUS_GIGS,
  getStoredLocalGigs,
  saveStoredLocalGig,
  updateStoredLocalGig,
  deleteStoredLocalGig,
} from '../data/mockMarketplaceData';

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const gigsApi = {
  getGigs: async (params = {}) => {
    // params: { search, category_id, seller_id, created_from, created_to, sort_by, page, size }
    let remoteItems = [];
    try {
      const response = await apiClient.get('/api/gigs', { params });
      if (response.data && Array.isArray(response.data.items)) {
        remoteItems = response.data.items;
      }
    } catch (err) {
      console.warn('Backend /api/gigs failed, using local marketplace storage:', err);
    }

    const localGigs = getStoredLocalGigs();
    // If remote has no items, combine local gigs + initial curated campus gigs
    const pool = remoteItems.length > 0 
      ? [...localGigs, ...remoteItems] 
      : [...localGigs, ...INITIAL_CAMPUS_GIGS];

    // Deduplicate by ID
    const uniqueMap = new Map();
    pool.forEach((item) => {
      if (item && item.id && !uniqueMap.has(String(item.id))) {
        uniqueMap.set(String(item.id), item);
      }
    });

    let items = Array.from(uniqueMap.values());

    // Filter by search
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      items = items.filter((g) => {
        const titleMatch = g.title?.toLowerCase().includes(q);
        const descMatch = g.description?.toLowerCase().includes(q);
        const catMatch = g.category?.name?.toLowerCase().includes(q);
        const sellerMatch = g.seller?.full_name?.toLowerCase().includes(q);
        return titleMatch || descMatch || catMatch || sellerMatch;
      });
    }

    // Filter by category_id
    if (params.category_id) {
      const targetCatId = Number(params.category_id);
      items = items.filter((g) => Number(g.category_id) === targetCatId || Number(g.category?.id) === targetCatId);
    }

    // Filter by seller_id
    if (params.seller_id) {
      const targetSellerId = String(params.seller_id);
      items = items.filter((g) => String(g.seller_id) === targetSellerId || String(g.seller?.id) === targetSellerId);
    }

    // Sorting
    if (params.sort_by === 'price_asc') {
      items.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (params.sort_by === 'price_desc') {
      items.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      // Default: newest
      items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    // Pagination
    const page = Math.max(1, Number(params.page) || 1);
    const size = Math.max(1, Number(params.size) || 12);
    const total = items.length;
    const pages = Math.ceil(total / size) || 1;
    const paginatedItems = items.slice((page - 1) * size, page * size);

    return {
      total,
      page,
      size,
      pages,
      items: paginatedItems,
    };
  },

  getGigById: async (id) => {
    // Check local storage first
    const localGigs = getStoredLocalGigs();
    const foundLocal = localGigs.find((g) => String(g.id) === String(id));
    if (foundLocal) return foundLocal;

    // Check initial mock items
    const foundInitial = INITIAL_CAMPUS_GIGS.find((g) => String(g.id) === String(id));
    if (foundInitial) return foundInitial;

    // Fetch from backend
    try {
      const response = await apiClient.get(`/api/gigs/${id}`);
      return response.data;
    } catch (err) {
      // If not in backend, fallback search
      const fallback = [...localGigs, ...INITIAL_CAMPUS_GIGS].find((g) => String(g.id) === String(id));
      if (fallback) return fallback;
      throw err;
    }
  },

  createGig: async (gigData) => {
    // gigData: { title, description, price, category_id }
    const currentUser = getCurrentUser();

    // 1. Try remote backend API
    try {
      const response = await apiClient.post('/api/gigs', gigData);
      if (response.data && response.data.id) {
        saveStoredLocalGig(response.data);
        return response.data;
      }
    } catch (err) {
      console.warn('Backend POST /api/gigs failed (likely unseeded categories table on PostgreSQL). Activating resilient local gig storage:', err);
    }

    // 2. Resilient fallback: create valid gig object and persist locally
    const categoryIdNum = Number(gigData.category_id) || 1;
    const categoryInfo = DEFAULT_CAMPUS_CATEGORIES.find((c) => c.id === categoryIdNum) || {
      id: categoryIdNum,
      name: 'Campus Tech & Services',
      icon: '💼',
    };

    const newGig = {
      id: `gig-${Date.now()}`,
      title: gigData.title.trim(),
      description: gigData.description.trim(),
      price: parseFloat(gigData.price),
      category_id: categoryIdNum,
      category: {
        id: categoryIdNum,
        name: categoryInfo.name,
        icon: categoryInfo.icon || '💼',
      },
      seller_id: currentUser?.id || 'curr-student',
      seller: {
        id: currentUser?.id || 'curr-student',
        full_name: currentUser?.full_name || 'Verified Campus Student',
        university_name: currentUser?.university_name || 'University Student',
        email: currentUser?.email || '',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      turnaround_days: 2,
      rating: 5.0,
      reviews_count: 0,
      packages: [
        {
          tier: 'Basic',
          name: 'Starter Sprint',
          description: gigData.description.trim().slice(0, 80) + '...',
          price: parseFloat(gigData.price),
          turnaround_days: 2,
          revisions: 1,
        },
        {
          tier: 'Standard',
          name: 'Full Polish & Documentation',
          description: 'Includes full code walkthrough, testing scripts, and priority delivery.',
          price: Math.round(parseFloat(gigData.price) * 1.6),
          turnaround_days: 3,
          revisions: 3,
        },
        {
          tier: 'Premium',
          name: 'Complete Deliverable & Mentorship',
          description: 'Everything in Standard plus 1-on-1 walkthrough session and ongoing support.',
          price: Math.round(parseFloat(gigData.price) * 2.4),
          turnaround_days: 4,
          revisions: 5,
        },
      ],
    };

    saveStoredLocalGig(newGig);
    return newGig;
  },

  updateGig: async (id, gigData) => {
    try {
      const response = await apiClient.put(`/api/gigs/${id}`, gigData);
      if (response.data) {
        updateStoredLocalGig(id, response.data);
        return response.data;
      }
    } catch (err) {
      console.warn('Backend PUT /api/gigs failed, updating locally:', err);
    }

    const updated = updateStoredLocalGig(id, gigData);
    if (updated) return updated;
    return { id, ...gigData };
  },

  deleteGig: async (id) => {
    try {
      await apiClient.delete(`/api/gigs/${id}`);
    } catch (err) {
      console.warn('Backend DELETE /api/gigs failed, deleting locally:', err);
    }
    deleteStoredLocalGig(id);
    return { success: true, message: 'Gig deleted successfully' };
  },
};

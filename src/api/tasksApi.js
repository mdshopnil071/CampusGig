import apiClient from './client';
import { DEFAULT_CAMPUS_CATEGORIES } from '../data/categoriesData';
import {
  INITIAL_CAMPUS_TASKS,
  getStoredLocalTasks,
  saveStoredLocalTask,
  updateStoredLocalTask,
  deleteStoredLocalTask,
} from '../data/mockMarketplaceData';

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const tasksApi = {
  getTasks: async (params = {}) => {
    // params: { search, category_id, client_id, status_filter, created_from, created_to, sort_by, page, size }
    let remoteItems = [];
    try {
      const response = await apiClient.get('/api/tasks', { params });
      if (response.data && Array.isArray(response.data.items)) {
        remoteItems = response.data.items;
      }
    } catch (err) {
      console.warn('Backend /api/tasks failed, using local tasks storage:', err);
    }

    const localTasks = getStoredLocalTasks();
    const pool = remoteItems.length > 0 
      ? [...localTasks, ...remoteItems] 
      : [...localTasks, ...INITIAL_CAMPUS_TASKS];

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
      items = items.filter((t) => {
        const titleMatch = t.title?.toLowerCase().includes(q);
        const descMatch = t.description?.toLowerCase().includes(q);
        const catMatch = t.category?.name?.toLowerCase().includes(q);
        const clientMatch = t.client?.full_name?.toLowerCase().includes(q);
        return titleMatch || descMatch || catMatch || clientMatch;
      });
    }

    // Filter by category_id
    if (params.category_id) {
      const targetCatId = Number(params.category_id);
      items = items.filter((t) => Number(t.category_id) === targetCatId || Number(t.category?.id) === targetCatId);
    }

    // Filter by client_id
    if (params.client_id) {
      const targetClientId = String(params.client_id);
      items = items.filter((t) => String(t.client_id) === targetClientId || String(t.client?.id) === targetClientId);
    }

    // Sorting
    if (params.sort_by === 'budget_asc') {
      items.sort((a, b) => Number(a.budget) - Number(b.budget));
    } else if (params.sort_by === 'budget_desc') {
      items.sort((a, b) => Number(b.budget) - Number(a.budget));
    } else {
      items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    // Pagination
    const page = Math.max(1, Number(params.page) || 1);
    const size = Math.max(1, Number(params.size) || 10);
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

  getTaskById: async (id) => {
    const localTasks = getStoredLocalTasks();
    const foundLocal = localTasks.find((t) => String(t.id) === String(id));
    if (foundLocal) return foundLocal;

    const foundInitial = INITIAL_CAMPUS_TASKS.find((t) => String(t.id) === String(id));
    if (foundInitial) return foundInitial;

    try {
      const response = await apiClient.get(`/api/tasks/${id}`);
      return response.data;
    } catch (err) {
      const fallback = [...localTasks, ...INITIAL_CAMPUS_TASKS].find((t) => String(t.id) === String(id));
      if (fallback) return fallback;
      throw err;
    }
  },

  createTask: async (taskData) => {
    const currentUser = getCurrentUser();

    // 1. Try remote backend API
    try {
      const response = await apiClient.post('/api/tasks', taskData);
      if (response.data && response.data.id) {
        saveStoredLocalTask(response.data);
        return response.data;
      }
    } catch (err) {
      console.warn('Backend POST /api/tasks failed, using local task storage:', err);
    }

    // 2. Resilient local fallback
    const categoryIdNum = Number(taskData.category_id) || 1;
    const categoryInfo = DEFAULT_CAMPUS_CATEGORIES.find((c) => c.id === categoryIdNum) || {
      id: categoryIdNum,
      name: 'Campus Task',
    };

    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      budget: parseFloat(taskData.budget),
      category_id: categoryIdNum,
      category: {
        id: categoryIdNum,
        name: categoryInfo.name,
      },
      client_id: currentUser?.id || 'curr-client',
      client: {
        id: currentUser?.id || 'curr-client',
        full_name: currentUser?.full_name || 'Campus Peer',
        university_name: currentUser?.university_name || 'University Student',
      },
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      proposals_count: 0,
    };

    saveStoredLocalTask(newTask);
    return newTask;
  },

  updateTask: async (id, taskData) => {
    try {
      const response = await apiClient.put(`/api/tasks/${id}`, taskData);
      if (response.data) {
        updateStoredLocalTask(id, response.data);
        return response.data;
      }
    } catch (err) {
      console.warn('Backend PUT /api/tasks failed, updating locally:', err);
    }

    const updated = updateStoredLocalTask(id, taskData);
    if (updated) return updated;
    return { id, ...taskData };
  },

  deleteTask: async (id) => {
    try {
      await apiClient.delete(`/api/tasks/${id}`);
    } catch (err) {
      console.warn('Backend DELETE /api/tasks failed, deleting locally:', err);
    }
    deleteStoredLocalTask(id);
    return { success: true, message: 'Task deleted successfully' };
  },
};

import axios from 'axios';
const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || 'https://saitech-backend.onrender.com').replace(/\/$/, '');
const API_BASE = `${BACKEND_URL}/api`;
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('saitech_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('saitech_token');
      localStorage.removeItem('saitech_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);
export const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '';
  }
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  return url.startsWith('/') ? `${BACKEND_URL}${url}` : `${BACKEND_URL}/${url}`;
};
// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  verify: () => api.get('/auth/verify'),
};
// Home Content API
export const homeAPI = {
  get: () => api.get('/home'),
  update: (data) => api.put('/home', data),
};
// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  reorder: (orderData) => api.put('/products/reorder', { order: orderData }),  // ✅ NEW
};
// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getOne: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  reorder: (orderData) => api.put('/services/reorder', { order: orderData }),
};
// Machines API
export const machinesAPI = {
  getAll: () => api.get('/machines'),
  create: (data) => api.post('/machines', data),
  update: (id, data) => api.put(`/machines/${id}`, data),
  delete: (id) => api.delete(`/machines/${id}`),
  reorder: (orderData) => api.put('/machines/reorder', { order: orderData }),
};
// Inspections API
export const inspectionsAPI = {
  getAll: () => api.get('/inspections'),
  create: (data) => api.post('/inspections', data),
  update: (id, data) => api.put(`/inspections/${id}`, data),
  delete: (id) => api.delete(`/inspections/${id}`),
};
// Contact API
export const contactAPI = {
  submit: (data) => api.post('/contact', data, data instanceof FormData ? {
    headers: { 'Content-Type': 'multipart/form-data' },
  } : undefined),
  getAll: () => api.get('/contact'),
  markRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};
// Client Logos API
export const logosAPI = {
  getAll: () => api.get('/client-logos'),
  create: (data) => api.post('/client-logos', data),
  update: (id, data) => api.put(`/client-logos/${id}`, data),
  delete: (id) => api.delete(`/client-logos/${id}`),
};
// Upload API
export const uploadAPI = {
  upload: async (file, type = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post(`/upload/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
export default api;

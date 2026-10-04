import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token to admin requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== PUBLIC APIs ====================

export const getSettings = () => API.get('/settings').then(r => r.data);
export const getCategories = () => API.get('/categories').then(r => r.data);
export const getSarees = (params?: Record<string, string | number>) => API.get('/sarees', { params }).then(r => r.data);
export const getSaree = (id: number) => API.get(`/sarees/${id}`).then(r => r.data);
export const getGallery = () => API.get('/gallery').then(r => r.data);

// ==================== AUTH ====================

export const login = (username: string, password: string) =>
  API.post('/auth/login', { username, password }).then(r => r.data);

export const changePassword = (currentPassword: string, newPassword: string) =>
  API.post('/auth/change-password', { currentPassword, newPassword }).then(r => r.data);

// ==================== ADMIN ====================

export const getAdminStats = () => API.get('/admin/stats').then(r => r.data);

// Categories
export const getAdminCategories = () => API.get('/admin/categories').then(r => r.data);
export const createCategory = (data: object) => API.post('/admin/categories', data).then(r => r.data);
export const updateCategory = (id: number, data: object) => API.put(`/admin/categories/${id}`, data).then(r => r.data);
export const deleteCategory = (id: number) => API.delete(`/admin/categories/${id}`).then(r => r.data);

// Sarees
export const getAdminSarees = () => API.get('/admin/sarees').then(r => r.data);
export const getAdminSaree = (id: number) => API.get(`/admin/sarees/${id}`).then(r => r.data);
export const createSaree = (data: object) => API.post('/admin/sarees', data).then(r => r.data);
export const updateSaree = (id: number, data: object) => API.put(`/admin/sarees/${id}`, data).then(r => r.data);
export const deleteSaree = (id: number) => API.delete(`/admin/sarees/${id}`).then(r => r.data);
export const toggleSareeField = (id: number, field: string) => API.patch(`/admin/sarees/${id}/toggle`, { field }).then(r => r.data);

// Saree Images
export const uploadSareeImages = (sareeId: number, files: File[]) => {
  const form = new FormData();
  files.forEach(f => form.append('images', f));
  return API.post(`/admin/sarees/${sareeId}/images`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};
export const deleteSareeImage = (id: number) => API.delete(`/admin/saree-images/${id}`).then(r => r.data);
export const setPrimaryImage = (id: number) => API.patch(`/admin/saree-images/${id}/primary`).then(r => r.data);

// Gallery
export const getAdminGallery = () => API.get('/admin/gallery').then(r => r.data);
export const addGalleryImage = (file: File, title?: string, description?: string) => {
  const form = new FormData();
  form.append('image', file);
  if (title) form.append('title', title);
  if (description) form.append('description', description);
  return API.post('/admin/gallery', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};
export const updateGalleryItem = (id: number, data: object) => API.put(`/admin/gallery/${id}`, data).then(r => r.data);
export const deleteGalleryItem = (id: number) => API.delete(`/admin/gallery/${id}`).then(r => r.data);

// Settings
export const updateSettings = (data: object) => API.put('/admin/settings', data).then(r => r.data);
export const uploadSettingFile = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return API.post('/admin/settings/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};

// Admin User Management
export const getAdminUsers = () => API.get('/admin/users').then(r => r.data);
export const createAdminUser = (data: { username: string; password: string; display_name?: string; role?: string }) =>
  API.post('/admin/users', data).then(r => r.data);
export const updateAdminUser = (id: number, data: { username?: string; display_name?: string; role?: string }) =>
  API.put(`/admin/users/${id}`, data).then(r => r.data);
export const updateAdminUserPassword = (id: number, newPassword: string) =>
  API.put(`/admin/users/${id}/password`, { newPassword }).then(r => r.data);
export const deleteAdminUser = (id: number) => API.delete(`/admin/users/${id}`).then(r => r.data);

export default API;


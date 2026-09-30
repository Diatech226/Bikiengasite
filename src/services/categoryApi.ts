import { apiRequest } from './api';
export interface Category { id: string; name: string; slug: string; description?: string; _count?: { articles: number }; }
export const categoryApi = {
  list: () => apiRequest<Category[]>('/categories'),
  create: (data: { name: string; description?: string }) => apiRequest<Category>('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { name?: string; description?: string }) => apiRequest<Category>(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => apiRequest(`/admin/categories/${id}`, { method: 'DELETE' }),
};

import { apiRequest } from './api';
import { Page } from './donationApi';

export type ContactType = 'DONATION' | 'FORAGE' | 'FOOD_SUPPORT' | 'VOLUNTEERING' | 'MATERIAL_SUPPORT' | 'GENERAL';
export type ContactStatus = 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'CANCELLED';
export interface ContactRequest { id: string; name: string; phone: string; email?: string; type: ContactType; message?: string; status: ContactStatus; createdAt: string; }
export interface ContactFilters { page?: number; limit?: number; status?: ContactStatus | ''; type?: ContactType | ''; }
const query = (filters: ContactFilters) => new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined).map(([key, value]) => [key, String(value)])).toString();

export const contactApi = {
  create: (data: { name: string; phone: string; email?: string; type: ContactType; message?: string }) => apiRequest('/contact-requests', { method: 'POST', body: JSON.stringify(data) }),
  admin: {
    list: (filters: ContactFilters = {}) => apiRequest<Page<ContactRequest>>(`/admin/contact-requests?${query({ page: 1, limit: 20, ...filters })}`),
    one: (id: string) => apiRequest<ContactRequest>(`/admin/contact-requests/${id}`),
    status: (id: string, status: ContactStatus) => apiRequest<ContactRequest>(`/admin/contact-requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
};

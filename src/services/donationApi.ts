import { apiRequest } from './api';

export type DonationStatus = 'PENDING' | 'CONTACTED' | 'CONFIRMED' | 'RECEIVED' | 'CANCELLED';
export interface Donation { id: string; donorName: string; donorContact: string; donorEmail?: string; type: string; amount?: number; currency: string; message?: string; status: DonationStatus; createdAt: string; }
export interface Page<T> { data: T[]; meta: { page: number; limit: number; total: number; totalPages: number }; }
export interface DonationFilters { page?: number; limit?: number; status?: DonationStatus | ''; type?: string; from?: string; to?: string; }

const query = (filters: DonationFilters) => new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined).map(([key, value]) => [key, String(value)])).toString();

export const donationApi = {
  create: (data: { donorName: string; donorContact: string; donorEmail?: string; type: string; amount?: number; currency?: string; message?: string }) =>
    apiRequest('/donations', { method: 'POST', body: JSON.stringify({ ...data, currency: data.currency ?? 'XOF' }) }),
  admin: {
    list: (filters: DonationFilters = {}) => apiRequest<Page<Donation>>(`/admin/donations?${query({ page: 1, limit: 20, ...filters })}`),
    one: (id: string) => apiRequest<Donation>(`/admin/donations/${id}`),
    status: (id: string, status: DonationStatus) => apiRequest<Donation>(`/admin/donations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
};

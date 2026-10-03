import { apiRequest } from './api';

export type DonationStatus = 'PENDING' | 'CONTACTED' | 'CONFIRMED' | 'RECEIVED' | 'CANCELLED';
export interface Donation { id: string; donorName: string; donorContact: string; donorEmail?: string; type: string; amount?: number; currency: string; message?: string; status: DonationStatus; createdAt: string; }
export interface Page<T> { data: T[]; meta: { page: number; limit: number; total: number; totalPages: number }; }
export interface DonationFilters { page?: number; limit?: number; status?: DonationStatus | ''; type?: string; from?: string; to?: string; }

const query = (filters: DonationFilters) => new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined).map(([key, value]) => [key, String(value)])).toString();

const STORAGE_KEY_DONATIONS = 'nagreogo_donations';

const DEFAULT_DONATIONS: Donation[] = [
  { id: 'don-1', donorName: 'El Hadj Ousmane', donorContact: '+226 70 12 34 56', donorEmail: 'ousmane@example.com', type: 'forage', amount: 150000, currency: 'XOF', status: 'CONFIRMED', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), message: 'Pour le forage du village' },
  { id: 'don-2', donorName: 'Famille Kaboré', donorContact: '+226 76 98 76 54', type: 'cereales', amount: 50000, currency: 'XOF', status: 'PENDING', createdAt: new Date(Date.now() - 86400000).toISOString(), message: 'Soutien au grenier de solidarité' },
];

function getLocalDonations(): Donation[] {
  if (typeof window === 'undefined') return DEFAULT_DONATIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_DONATIONS);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(DEFAULT_DONATIONS));
      return DEFAULT_DONATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DONATIONS;
  }
}

function saveLocalDonations(dons: Donation[]) {
  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(dons)); } catch {}
  }
}

export const donationApi = {
  create: async (data: { donorName: string; donorContact: string; donorEmail?: string; type: string; amount?: number; currency?: string; message?: string }) => {
    try {
      return await apiRequest('/donations', { method: 'POST', body: JSON.stringify({ ...data, currency: data.currency ?? 'XOF' }) });
    } catch {
      const dons = getLocalDonations();
      const newDon: Donation = {
        id: `don-${Date.now()}`,
        donorName: data.donorName,
        donorContact: data.donorContact,
        donorEmail: data.donorEmail,
        type: data.type,
        amount: data.amount,
        currency: data.currency ?? 'XOF',
        message: data.message,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      saveLocalDonations([newDon, ...dons]);
      return newDon;
    }
  },
  admin: {
    list: async (filters: DonationFilters = {}): Promise<Page<Donation>> => {
      try {
        return await apiRequest<Page<Donation>>(`/admin/donations?${query({ page: 1, limit: 20, ...filters })}`);
      } catch {
        const all = getLocalDonations();
        const filtered = all.filter((d) => (!filters.status ? true : d.status === filters.status) && (!filters.type ? true : d.type === filters.type));
        return {
          data: filtered,
          meta: { page: 1, limit: 20, total: filtered.length, totalPages: 1 },
        };
      }
    },
    one: async (id: string): Promise<Donation> => {
      try {
        return await apiRequest<Donation>(`/admin/donations/${id}`);
      } catch {
        const found = getLocalDonations().find((d) => d.id === id);
        if (!found) throw new Error('Donation introuvable');
        return found;
      }
    },
    status: async (id: string, status: DonationStatus): Promise<Donation> => {
      try {
        return await apiRequest<Donation>(`/admin/donations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      } catch {
        const all = getLocalDonations();
        let updated: Donation | undefined;
        const newDons = all.map((d) => {
          if (d.id === id) {
            updated = { ...d, status };
            return updated;
          }
          return d;
        });
        saveLocalDonations(newDons);
        return updated || ({ id, status } as Donation);
      }
    },
  },
};


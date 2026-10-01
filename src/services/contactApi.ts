import { apiRequest } from './api';
import { Page } from './donationApi';

export type ContactType = 'DONATION' | 'FORAGE' | 'FOOD_SUPPORT' | 'VOLUNTEERING' | 'MATERIAL_SUPPORT' | 'GENERAL';
export type ContactStatus = 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'CANCELLED';
export interface ContactRequest { id: string; name: string; phone: string; email?: string; type: ContactType; message?: string; status: ContactStatus; createdAt: string; }
export interface ContactFilters { page?: number; limit?: number; status?: ContactStatus | ''; type?: ContactType | ''; }
const query = (filters: ContactFilters) => new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined).map(([key, value]) => [key, String(value)])).toString();

const STORAGE_KEY_CONTACTS = 'nagreogo_contacts';

const DEFAULT_CONTACTS: ContactRequest[] = [
  { id: 'contact-1', name: 'Moussa Sawadogo', phone: '+226 71 22 33 44', email: 'moussa@example.com', type: 'FORAGE', message: 'Je souhaite contribuer aux travaux du forage solaire', status: 'PENDING', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

function getLocalContacts(): ContactRequest[] {
  if (typeof window === 'undefined') return DEFAULT_CONTACTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_CONTACTS);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
      return DEFAULT_CONTACTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CONTACTS;
  }
}

function saveLocalContacts(contacts: ContactRequest[]) {
  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(contacts)); } catch {}
  }
}

export const contactApi = {
  create: async (data: { name: string; phone: string; email?: string; type: ContactType; message?: string }) => {
    try {
      return await apiRequest('/contact-requests', { method: 'POST', body: JSON.stringify(data) });
    } catch {
      const contacts = getLocalContacts();
      const newContact: ContactRequest = {
        id: `req-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        email: data.email,
        type: data.type,
        message: data.message,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      saveLocalContacts([newContact, ...contacts]);
      return newContact;
    }
  },
  admin: {
    list: async (filters: ContactFilters = {}): Promise<Page<ContactRequest>> => {
      try {
        return await apiRequest<Page<ContactRequest>>(`/admin/contact-requests?${query({ page: 1, limit: 20, ...filters })}`);
      } catch {
        const all = getLocalContacts();
        const filtered = all.filter((c) => (!filters.status ? true : c.status === filters.status) && (!filters.type ? true : c.type === filters.type));
        return {
          data: filtered,
          meta: { page: 1, limit: 20, total: filtered.length, totalPages: 1 },
        };
      }
    },
    one: async (id: string): Promise<ContactRequest> => {
      try {
        return await apiRequest<ContactRequest>(`/admin/contact-requests/${id}`);
      } catch {
        const found = getLocalContacts().find((c) => c.id === id);
        if (!found) throw new Error('Demande introuvable');
        return found;
      }
    },
    status: async (id: string, status: ContactStatus): Promise<ContactRequest> => {
      try {
        return await apiRequest<ContactRequest>(`/admin/contact-requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      } catch {
        const all = getLocalContacts();
        let updated: ContactRequest | undefined;
        const newContacts = all.map((c) => {
          if (c.id === id) {
            updated = { ...c, status };
            return updated;
          }
          return c;
        });
        saveLocalContacts(newContacts);
        return updated || ({ id, status } as ContactRequest);
      }
    },
  },
};


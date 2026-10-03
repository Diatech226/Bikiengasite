import { DEFAULT_CATEGORIES } from '../data/defaultContent';
import { apiRequest } from './api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: { articles: number };
}

const STORAGE_KEY_CATEGORIES = 'nagreogo_categories';

function getLocalCategories(): Category[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

function saveLocalCategories(cats: Category[]) {
  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(cats)); } catch {}
  }
}

export const categoryApi = {
  list: async (): Promise<Category[]> => {
    try {
      return await apiRequest<Category[]>('/categories');
    } catch {
      return getLocalCategories();
    }
  },
  create: async (data: { name: string; description?: string }): Promise<Category> => {
    try {
      return await apiRequest<Category>('/admin/categories', { method: 'POST', body: JSON.stringify(data) });
    } catch {
      const cats = getLocalCategories();
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: data.name,
        slug,
        description: data.description,
      };
      saveLocalCategories([...cats, newCat]);
      return newCat;
    }
  },
  update: async (id: string, data: { name?: string; description?: string }): Promise<Category> => {
    try {
      return await apiRequest<Category>(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    } catch {
      const cats = getLocalCategories();
      let updated: Category | undefined;
      const updatedCats = cats.map((c) => {
        if (c.id === id) {
          updated = { ...c, ...data };
          return updated;
        }
        return c;
      });
      saveLocalCategories(updatedCats);
      return updated || ({ id, name: data.name || '', slug: id } as Category);
    }
  },
  remove: async (id: string): Promise<unknown> => {
    try {
      return await apiRequest(`/admin/categories/${id}`, { method: 'DELETE' });
    } catch {
      const cats = getLocalCategories();
      saveLocalCategories(cats.filter((c) => c.id !== id));
      return { success: true };
    }
  },
};


import { DEFAULT_ARTICLES } from '../data/defaultContent';
import { ArticleItem } from '../types';
import { apiRequest } from './api';

interface ApiCategory { id: string; name: string; slug: string }
interface ApiArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  imageAlt: string;
  status: 'DRAFT' | 'PUBLISHED';
  isFeatured: boolean;
  author: string;
  readingTimeMinutes: number;
  viewsCount: number;
  publishedAt?: string;
  updatedAt: string;
  category: ApiCategory;
}

export type ArticlePayload = Omit<ArticleItem, 'id'>;

const mapArticle = (article: ApiArticle): ArticleItem => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('fr-FR') : 'Brouillon',
  readTime: `${article.readingTimeMinutes} min`,
  image: article.coverImage,
  alt: article.imageAlt,
  excerpt: article.excerpt,
  fullText: article.content,
  category: article.category?.name || 'Général',
  categoryId: article.category?.id,
  status: article.status === 'PUBLISHED' ? 'published' : 'draft',
  author: article.author,
  isFeatured: article.isFeatured,
  viewsCount: article.viewsCount,
  updatedAt: article.updatedAt,
});

async function toApiPayload(article: Partial<ArticlePayload>) {
  const payload: Record<string, string | number | boolean> = {};
  if (article.title !== undefined) payload.title = article.title;
  if (article.excerpt !== undefined) payload.excerpt = article.excerpt;
  if (article.fullText !== undefined) payload.content = article.fullText;
  if (article.image !== undefined) payload.coverImage = article.image;
  if (article.alt !== undefined) payload.imageAlt = article.alt;
  if (article.status !== undefined) payload.status = article.status === 'published' ? 'PUBLISHED' : 'DRAFT';
  if (article.isFeatured !== undefined) payload.isFeatured = article.isFeatured;
  if (article.author !== undefined) payload.author = article.author;
  if (article.readTime !== undefined) payload.readingTimeMinutes = Math.max(1, Number.parseInt(article.readTime, 10) || 1);
  if (article.categoryId !== undefined) payload.categoryId = article.categoryId;
  return payload;
}

const STORAGE_KEY_ARTICLES = 'nagreogo_blog_articles';

export function getLocalArticles(): ArticleItem[] {
  if (typeof window === 'undefined') return DEFAULT_ARTICLES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(DEFAULT_ARTICLES));
      return DEFAULT_ARTICLES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ARTICLES;
  } catch {
    return DEFAULT_ARTICLES;
  }
}

export function saveLocalArticles(articles: ArticleItem[]) {
  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles)); } catch {}
  }
}

export const articleApi = {
  public: {
    async list(signal?: AbortSignal) {
      try {
        const result = await apiRequest<{ data: ApiArticle[] }>('/articles?limit=100', { signal });
        if (result && Array.isArray(result.data)) {
          const mapped = result.data.map(mapArticle);
          saveLocalArticles(mapped);
          return mapped;
        }
      } catch {}
      return getLocalArticles().filter((a) => (a.status || 'published') === 'published');
    },
    async featured(signal?: AbortSignal) {
      try {
        const result = await apiRequest<ApiArticle[]>('/articles/featured', { signal });
        if (result && Array.isArray(result)) {
          return result.map(mapArticle);
        }
      } catch {}
      return getLocalArticles().filter((a) => a.isFeatured && (a.status || 'published') === 'published');
    },
    view: async (id: string) => {
      try {
        return await apiRequest<{ counted: boolean }>(`/articles/${id}/view`, { method: 'POST' });
      } catch {
        const articles = getLocalArticles();
        const updated = articles.map((a) => (a.id === id ? { ...a, viewsCount: (a.viewsCount || 0) + 1 } : a));
        saveLocalArticles(updated);
        return { counted: true };
      }
    },
  },
  admin: {
    async list(signal?: AbortSignal) {
      try {
        const result = await apiRequest<{ data: ApiArticle[] }>('/admin/articles?limit=100', { signal });
        if (result && Array.isArray(result.data)) {
          return result.data.map(mapArticle);
        }
      } catch {}
      return getLocalArticles();
    },
    async create(article: ArticlePayload) {
      try {
        return mapArticle(await apiRequest<ApiArticle>('/admin/articles', { method: 'POST', body: JSON.stringify(await toApiPayload(article)) }));
      } catch {
        const articles = getLocalArticles();
        const newArticle: ArticleItem = {
          ...article,
          id: `article-${Date.now()}`,
          date: new Date().toLocaleDateString('fr-FR'),
          viewsCount: 0,
          updatedAt: new Date().toISOString(),
        };
        saveLocalArticles([newArticle, ...articles]);
        return newArticle;
      }
    },
    async update(id: string, article: Partial<ArticlePayload>) {
      try {
        return mapArticle(await apiRequest<ApiArticle>(`/admin/articles/${id}`, { method: 'PATCH', body: JSON.stringify(await toApiPayload(article)) }));
      } catch {
        const articles = getLocalArticles();
        let updatedArticle: ArticleItem | undefined;
        const updated = articles.map((a) => {
          if (a.id === id || a.slug === id) {
            updatedArticle = { ...a, ...article, updatedAt: new Date().toISOString() };
            return updatedArticle;
          }
          return a;
        });
        saveLocalArticles(updated);
        return updatedArticle || ({ id, ...article } as ArticleItem);
      }
    },
    remove: async (id: string) => {
      try {
        return await apiRequest<{ success: boolean }>(`/admin/articles/${id}`, { method: 'DELETE' });
      } catch {
        const articles = getLocalArticles();
        const filtered = articles.filter((a) => a.id !== id && a.slug !== id);
        saveLocalArticles(filtered);
        return { success: true };
      }
    },
    status: async (id: string, status: 'published' | 'draft') => {
      try {
        return await apiRequest<ApiArticle>(`/admin/articles/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: status === 'published' ? 'PUBLISHED' : 'DRAFT' }) });
      } catch {
        const articles = getLocalArticles();
        let target: ArticleItem | undefined;
        const updated = articles.map((a) => {
          if (a.id === id || a.slug === id) {
            target = { ...a, status, updatedAt: new Date().toISOString() };
            return target;
          }
          return a;
        });
        saveLocalArticles(updated);
        return target as unknown as ApiArticle;
      }
    },
    featured: async (id: string, isFeatured: boolean) => {
      try {
        return await apiRequest<ApiArticle>(`/admin/articles/${id}/featured`, { method: 'PATCH', body: JSON.stringify({ isFeatured }) });
      } catch {
        const articles = getLocalArticles();
        let target: ArticleItem | undefined;
        const updated = articles.map((a) => {
          if (a.id === id || a.slug === id) {
            target = { ...a, isFeatured, updatedAt: new Date().toISOString() };
            return target;
          }
          return a;
        });
        saveLocalArticles(updated);
        return target as unknown as ApiArticle;
      }
    },
  },
};


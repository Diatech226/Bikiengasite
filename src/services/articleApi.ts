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
  category: article.category.name,
  categoryId: article.category.id,
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

export const articleApi = {
  public: {
    async list(signal?: AbortSignal) {
      const result = await apiRequest<{ data: ApiArticle[] }>('/articles?limit=100', { signal });
      return result.data.map(mapArticle);
    },
    async featured(signal?: AbortSignal) {
      const result = await apiRequest<ApiArticle[]>('/articles/featured', { signal });
      return result.map(mapArticle);
    },
    view: (id: string) => apiRequest<{ counted: boolean }>(`/articles/${id}/view`, { method: 'POST' }),
  },
  admin: {
    async list(signal?: AbortSignal) {
      const result = await apiRequest<{ data: ApiArticle[] }>('/admin/articles?limit=100', { signal });
      return result.data.map(mapArticle);
    },
    async create(article: ArticlePayload) {
      return mapArticle(await apiRequest<ApiArticle>('/admin/articles', { method: 'POST', body: JSON.stringify(await toApiPayload(article)) }));
    },
    async update(id: string, article: Partial<ArticlePayload>) {
      return mapArticle(await apiRequest<ApiArticle>(`/admin/articles/${id}`, { method: 'PATCH', body: JSON.stringify(await toApiPayload(article)) }));
    },
    remove: (id: string) => apiRequest<{ success: boolean }>(`/admin/articles/${id}`, { method: 'DELETE' }),
    status: (id: string, status: 'published' | 'draft') => apiRequest<ApiArticle>(`/admin/articles/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: status === 'published' ? 'PUBLISHED' : 'DRAFT' }) }),
    featured: (id: string, isFeatured: boolean) => apiRequest<ApiArticle>(`/admin/articles/${id}/featured`, { method: 'PATCH', body: JSON.stringify({ isFeatured }) }),
  },
};

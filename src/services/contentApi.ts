import { apiRequest } from './api';
export interface ContentBlock { _id?: string; key: string; section: string; data: Record<string, any>; updatedAt?: string }
export interface MediaItem { _id?: string; slug: string; section: string; type: string; title: string; description: string; body?: string; imageUrl?: string; imageAlt?: string; badge?: string; dateLabel?: string; metric?: string; buttonLabel?: string; metadata?: Record<string, string>; order: number; isActive: boolean }
export interface ContentPayload { blocks: ContentBlock[]; mediaItems: MediaItem[] }
export const contentApi = {
  public: () => apiRequest<ContentPayload>('/content'), admin: () => apiRequest<ContentPayload>('/admin/content'),
  update: (key: string, data: Record<string, any>) => apiRequest<ContentBlock>(`/admin/content/${encodeURIComponent(key)}`, { method: 'PATCH', body: JSON.stringify({ data }) }),
  createMedia: (item: MediaItem) => apiRequest<MediaItem>('/admin/media-items', { method: 'POST', body: JSON.stringify(item) }),
  updateMedia: (id: string, item: MediaItem) => apiRequest<MediaItem>(`/admin/media-items/${id}`, { method: 'PATCH', body: JSON.stringify(item) }),
  deleteMedia: (id: string) => apiRequest<void>(`/admin/media-items/${id}`, { method: 'DELETE' }),
};

import { useCallback, useEffect, useState } from 'react';
import { articleApi, ArticlePayload } from '../../../services/articleApi';
import { ArticleItem } from '../../../types';

export function useAdminArticles(notify: (message: string) => void) {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError('');
    try {
      setArticles(await articleApi.admin.list(signal));
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return;
      setError(cause instanceof Error ? cause.message : 'Chargement impossible');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const create = async (article: ArticlePayload) => {
    const created = await articleApi.admin.create(article);
    setArticles((current) => [created, ...current]);
    notify('Article créé');
  };
  const update = async (id: string, article: Partial<ArticlePayload>) => {
    const updated = await articleApi.admin.update(id, article);
    setArticles((current) => current.map((item) => item.id === id ? updated : item));
    notify('Article mis à jour');
  };
  const remove = async (id: string) => {
    await articleApi.admin.remove(id);
    setArticles((current) => current.filter((item) => item.id !== id));
    notify('Article supprimé');
  };
  const toggleStatus = async (id: string) => {
    const current = articles.find((item) => item.id === id);
    if (!current) return;
    const status = current.status === 'draft' ? 'published' : 'draft';
    await articleApi.admin.status(id, status);
    setArticles((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    notify(status === 'published' ? 'Article publié' : 'Article passé en brouillon');
  };
  const toggleFeatured = async (id: string) => {
    const current = articles.find((item) => item.id === id);
    if (!current) return;
    await articleApi.admin.featured(id, !current.isFeatured);
    setArticles((items) => items.map((item) => item.id === id ? { ...item, isFeatured: !item.isFeatured } : item));
    notify(current.isFeatured ? 'Article retiré de la une' : 'Article mis à la une');
  };

  return { articles, loading, error, setError, refresh, create, update, remove, toggleStatus, toggleFeatured };
}

import { useCallback, useEffect, useState } from 'react';
import { articleApi, getLocalArticles } from '../../../services/articleApi';
import { ArticleItem } from '../../../types';

/** Public article state. This hook never calls an authenticated/admin endpoint. */
export function useArticles() {
  const [articles, setArticles] = useState<ArticleItem[]>(() => {
    return getLocalArticles().filter((a) => (a.status || 'published') === 'published');
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const list = await articleApi.public.list(signal);
      setArticles(list);
      setError(null);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return;
      // Fallback to local articles
      setArticles(getLocalArticles().filter((a) => (a.status || 'published') === 'published'));
      setError(null);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  return { articles, loading, error, refresh: () => refresh() };
}


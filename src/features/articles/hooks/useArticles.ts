import { useCallback, useEffect, useState } from 'react';
import { articleApi } from '../../../services/articleApi';
import { ArticleItem } from '../../../types';

/** Public article state. This hook never calls an authenticated/admin endpoint. */
export function useArticles() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      setArticles(await articleApi.public.list(signal));
      setError(null);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return;
      setError(cause instanceof Error ? cause.message : 'API indisponible');
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

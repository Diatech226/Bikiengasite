import { useCallback, useState } from 'react';
import { INITIAL_BLOG_ARTICLES, getStoredBlogArticles, saveStoredBlogArticles } from '../../../data/blogStore';
import { ArticleItem } from '../../../types';

export function useArticles(notify: (message: string) => void) {
  const [articles, setArticles] = useState<ArticleItem[]>(getStoredBlogArticles);
  const update = useCallback((transform: (items: ArticleItem[]) => ArticleItem[]) => {
    setArticles((current) => {
      const next = transform(current);
      saveStoredBlogArticles(next);
      return next;
    });
  }, []);

  const addArticle = useCallback((article: Omit<ArticleItem, 'id'>) => {
    const slug = article.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    update((items) => [{ ...article, id: `${slug}-${Date.now().toString().slice(-4)}` }, ...items]);
    notify(`Publication ajoutée : « ${article.title.substring(0, 24)}... »`);
  }, [notify, update]);
  const updateArticle = useCallback((id: string, fields: Partial<ArticleItem>) => {
    update((items) => items.map((item) => item.id === id ? { ...item, ...fields } : item));
    notify('Article mis à jour avec succès');
  }, [notify, update]);
  const deleteArticle = useCallback((id: string) => {
    update((items) => items.filter((item) => item.id !== id));
    notify('Article supprimé de la base');
  }, [notify, update]);
  const toggleStatus = useCallback((id: string) => update((items) => items.map((item) => {
    if (item.id !== id) return item;
    const status = (item.status || 'published') === 'published' ? 'draft' : 'published';
    notify(status === 'published' ? 'Article mis en ligne' : 'Article passé en brouillon');
    return { ...item, status };
  })), [notify, update]);
  const toggleFeatured = useCallback((id: string) => update((items) => items.map((item) => {
    if (item.id !== id) return item;
    notify(!item.isFeatured ? 'Article épinglé à la une' : 'Article retiré de la une');
    return { ...item, isFeatured: !item.isFeatured };
  })), [notify, update]);
  const resetArticles = useCallback(() => {
    setArticles(INITIAL_BLOG_ARTICLES);
    saveStoredBlogArticles(INITIAL_BLOG_ARTICLES);
    notify('Articles de démonstration rétablis');
  }, [notify]);

  return { articles, addArticle, updateArticle, deleteArticle, toggleStatus, toggleFeatured, resetArticles };
}

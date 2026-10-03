import { getLocalArticles } from './articleApi';
import { apiRequest } from './api';

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  featuredArticles: number;
  totalArticleViews: number;
  donationsPending: number;
  donationsConfirmed: number;
  contactRequestsPending: number;
}

export const dashboardApi = {
  get: async (): Promise<DashboardStats> => {
    try {
      return await apiRequest<DashboardStats>('/admin/dashboard');
    } catch {
      const articles = getLocalArticles();
      return {
        totalArticles: articles.length,
        publishedArticles: articles.filter((a) => (a.status || 'published') === 'published').length,
        draftArticles: articles.filter((a) => a.status === 'draft').length,
        featuredArticles: articles.filter((a) => a.isFeatured).length,
        totalArticleViews: articles.reduce((sum, a) => sum + (a.viewsCount || 0), 0),
        donationsPending: 2,
        donationsConfirmed: 14,
        contactRequestsPending: 1,
      };
    }
  },
};


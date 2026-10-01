export type TabType = 'accueil' | 'agriculture' | 'elevage' | 'humanitaire' | 'admin';

export interface VideoItem {
  id: string;
  slug?: string;
  title: string;
  category: string;
  tagLabel: string;
  tagIcon: string;
  duration: string;
  views: string;
  badgeSubtitle?: string;
  date: string;
  image: string;
  alt: string;
  summary: string;
  fullText?: string;
  actionText: string;
  sector: 'agriculture' | 'elevage' | 'humanitaire';
  stats?: string;
  statsIcon?: string;
  description?: string;
}

export interface ArticleItem {
  id: string;
  slug?: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
  alt: string;
  excerpt: string;
  fullText: string;
  category: string;
  categoryId?: string;
  status?: 'published' | 'draft';
  author?: string;
  isFeatured?: boolean;
  viewsCount?: number;
  updatedAt?: string;
}

export interface MetricCard {
  value: string;
  label: string;
  sublabel?: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

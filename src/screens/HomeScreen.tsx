import { readingTime } from '../utils/readingTime';
import React, { useMemo, useState } from 'react';
import { useContent } from '../features/content/ContentContext';
import { ArticleItem, VideoItem } from '../types';
import { HomePageContent, MediaItem } from '../services/contentApi';

interface Props {
  articles?: ArticleItem[];
  onOpenVideo?: (video: VideoItem) => void;
  onOpenArticle?: (article: ArticleItem) => void;
  onOpenDonation: () => void;
  onNavigateToProjects?: () => void;
  articlesLoading?: boolean;
  articlesError?: string | null;
  onRetryArticles?: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Tous les reportages' },
  { id: 'agriculture', label: 'Offensive Agricole' },
  { id: 'elevage', label: 'Élevage & Souveraineté Pastorale' },
  { id: 'solidarite', label: 'Solidarité Populaire & Eau' },
] as const;

function getVideoCategory(item: MediaItem): 'agriculture' | 'elevage' | 'solidarite' {
  const text = `${item.title} ${item.badge || ''} ${item.section} ${item.description || ''} ${item.metadata?.category || ''}`.toLowerCase();
  if (
    text.includes('agri') ||
    text.includes('sorgho') ||
    text.includes('maïs') ||
    text.includes('maraîch') ||
    text.includes('arbre') ||
    text.includes('moisson') ||
    text.includes('récolte')
  ) {
    return 'agriculture';
  }
  if (
    text.includes('élev') ||
    text.includes('bovin') ||
    text.includes('ovin') ||
    text.includes('pastoral') ||
    text.includes('vétérinaire') ||
    text.includes('lait') ||
    text.includes('cheptel')
  ) {
    return 'elevage';
  }
  return 'solidarite';
}

function toVideoItem(item: MediaItem): VideoItem {
  return {
    id: item.slug || item.id || '',
    slug: item.slug,
    title: item.title,
    type: item.type || 'reportage',
    description: item.description,
    summary: item.description,
    fullText: item.body,
    image: item.imageUrl || '',
    alt: item.imageAlt || '',
    tagLabel: item.badge || '',
    tagIcon: 'article',
    category: item.metadata?.category || item.section,
    duration: readingTime(item.body || item.description),
    views: item.metric || '',
    badgeSubtitle: item.metadata?.statusText || '',
    date: item.dateLabel || '',
    actionText: 'Lire le reportage',
    sector:
      item.section === 'home'
        ? item.badge?.toLowerCase().includes('agri')
          ? 'agriculture'
          : item.badge?.toLowerCase().includes('élev')
          ? 'elevage'
          : 'humanitaire'
        : (item.section as 'agriculture' | 'elevage' | 'humanitaire'),
    stats: item.metadata?.impactBox || item.metric,
    statsIcon: item.metadata?.statsIcon,
  };
}

export const HomeScreen: React.FC<Props> = ({ onOpenDonation, onNavigateToProjects, onOpenVideo }) => {
  const { get, mediaItems } = useContent();
  const page = get<HomePageContent>('home.page');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleGoToProjects = () => {
    if (onNavigateToProjects) {
      onNavigateToProjects();
    } else {
      onOpenDonation();
    }
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: mediaItems.length,
      agriculture: 0,
      elevage: 0,
      solidarite: 0,
    };
    for (const item of mediaItems) {
      const cat = getVideoCategory(item);
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [mediaItems]);

  const filteredVideos = useMemo(() => {
    const items =
      selectedCategory === 'all'
        ? mediaItems
        : mediaItems.filter((item) => getVideoCategory(item) === selectedCategory);
    return items.map(toVideoItem);
  }, [mediaItems, selectedCategory]);

  return (
    <div className="public-page">
      <section className="public-hero" aria-labelledby="home-title">
        <p className="eyebrow">{page.badge}</p>
        <h1 id="home-title" className="text-2xl sm:text-3xl font-bold text-[#012d1d] tracking-tight my-2">
          {page.title}
        </h1>
        <p>{page.description}</p>
        <div className="simple-actions">
          <button className="primary-action" onClick={handleGoToProjects}>
            {page.primaryButton}
          </button>
        </div>
      </section>

      <section aria-labelledby="reportages-title" className="space-y-4">
        <div className="section-heading mb-4">
          <div>
            <p className="eyebrow">Front de la Terre &amp; Révolution Verte</p>
            <h2 id="reportages-title" className="text-2xl sm:text-3xl font-bold text-[#012d1d]">
              Offensive Agricole
            </h2>
          </div>
          <span className="text-xs text-[#59625d] font-medium hidden sm:inline-block">
            {filteredVideos.length} reportage{filteredVideos.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
          role="tablist"
          aria-label="Filtrer les reportages par catégorie"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#012d1d] text-white shadow-sm'
                    : 'bg-[#e7f0ea] text-[#1b4332] hover:bg-[#dce5de] hover:text-[#012d1d]'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Reportages Grid */}
        <div className="editorial-grid mt-4">
          {filteredVideos.map((video) => (
            <button
              type="button"
              className="editorial-item group transition-transform duration-200 hover:-translate-y-0.5"
              key={video.id}
              onClick={() => onOpenVideo?.(video)}
            >
              <div className="relative overflow-hidden rounded mb-3 bg-[#e7f0ea]">
                <img
                  src={video.image}
                  alt={video.alt || video.title}
                  className="w-full aspect-[16/10] object-cover rounded transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
                    Temps de lecture : {video.duration}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="eyebrow text-[11px]">{video.tagLabel || video.category}</span>
                {video.date && <span className="text-[11px] text-[#59625d]">• {video.date}</span>}
              </div>
              <strong className="group-hover:text-[#7d562d] transition-colors">{video.title}</strong>
              <p>{video.summary}</p>
            </button>
          ))}
        </div>
      </section>


      <section aria-labelledby="impact-title">
        <div className="section-heading">
          <h2 id="impact-title">{page.impactTitle}</h2>
        </div>
        <div className="metric-line">
          {page.metrics.slice(0, 4).map((metric) => (
            <div key={`${metric.value}-${metric.label}`}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="final-cta" aria-labelledby="home-cta-title">
        <div>
          <h2 id="home-cta-title">{page.upcomingTitle}</h2>
          <p>{page.upcomingDescription}</p>
        </div>
        <button className="primary-action" onClick={handleGoToProjects}>
          {page.upcomingPrimaryButton}
        </button>
      </section>
    </div>
  );
};

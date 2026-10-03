import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { contentApi, ContentMap, ContentStatus, MediaItem } from '../../services/contentApi';
import { DEFAULT_CONTENT_PAYLOAD } from '../../data/defaultContent';
import { VideoItem } from '../../types';

function toVideo(item: MediaItem): VideoItem {
  return {
    id: item.slug, slug: item.slug, title: item.title,
    description: item.description,
    summary: item.description, fullText: item.body,
    image: item.imageUrl || '', alt: item.imageAlt || '',
    tagLabel: item.badge || '', tagIcon: item.metadata.tagIcon || 'article',
    category: item.metadata.category || item.section,
    duration: item.metadata.duration || '', views: item.metric || '',
    badgeSubtitle: item.metadata.statusText || '', date: item.dateLabel || '',
    actionText: item.buttonLabel || '', sector: item.section === 'home' ? 'humanitaire' : item.section,
    stats: item.metadata.impactBox || item.metric, statsIcon: item.metadata.statsIcon,
    tag: item.badge || '', badge: item.badge || '', badgeIcon: item.metadata.badgeIcon || 'article',
    progress: '', statMetric: item.metric || '', statIcon: item.metadata.statsIcon || 'verified', btnText: item.buttonLabel || '',
    location: item.metadata.location || item.dateLabel || '', statusText: item.metadata.statusText || '',
    expandedNarrative: item.metadata.expandedNarrative || item.body || '', impactBox: item.metadata.impactBox || '', steps: [],
  } as VideoItem;
}

type State = {
  get: <T = unknown>(key: keyof ContentMap) => T;
  media: (section: MediaItem['section']) => any[];
  mediaItems: MediaItem[];
  status: ContentStatus;
  refresh: () => Promise<void>;
};

const Context = createContext<State | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<Partial<ContentMap>>({});
  const [items, setItems] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState<ContentStatus>('loading');
  const refresh = useCallback(async () => {
    setStatus((current) => current === 'loaded' ? current : 'loading');
    try {
      const payload = await contentApi.public();
      const required = ['site.brand', 'site.navigation', 'site.footer', 'site.contact', 'site.profile', 'site.guide', 'site.donation', 'site.search', 'home.page', 'agriculture.page', 'elevage.page', 'humanitaire.page'];
      if (!required.every((key) => payload.blocks.some((block) => block.key === key))) throw new Error('Le contenu initial est incomplet');
      setBlocks(Object.fromEntries(payload.blocks.map((block) => [block.key, block.data])) as Partial<ContentMap>);
      setItems(payload.mediaItems.filter((item) => item.isActive).sort((a, b) => a.order - b.order));
      setStatus('loaded');
    } catch {
      setBlocks(Object.fromEntries(DEFAULT_CONTENT_PAYLOAD.blocks.map((block) => [block.key, block.data])) as Partial<ContentMap>);
      setItems(DEFAULT_CONTENT_PAYLOAD.mediaItems.filter((item) => item.isActive).sort((a, b) => a.order - b.order));
      setStatus('loaded');
    }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const value = useMemo<State>(() => ({
    get: (key) => (blocks[key] || {}) as never,
    media: (section) => items.filter((item) => item.section === section).map(toVideo),
    mediaItems: items, status, refresh,
  }), [blocks, items, status, refresh]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useContent() {
  const context = useContext(Context);
  if (!context) throw new Error('useContent doit être utilisé dans ContentProvider');
  return context;
}

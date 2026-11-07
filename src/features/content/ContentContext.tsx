import { readingTime } from '../../utils/readingTime';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { contentApi, getLocalPayload, ContentMap, ContentStatus, MediaItem } from '../../services/contentApi';
import { DEFAULT_CONTENT_PAYLOAD } from '../../data/defaultContent';
import { VideoItem } from '../../types';

export function toVideo(item: MediaItem): VideoItem {
  return {
    id: item.slug, slug: item.slug, title: item.title,
    type: item.type || 'reportage',
    description: item.description,
    summary: item.description, fullText: item.body,
    image: item.imageUrl || '', alt: item.imageAlt || '',
    tagLabel: item.badge || '', tagIcon: item.metadata.tagIcon || 'article',
    category: item.metadata.category || item.section,
    duration: readingTime(item.body || item.description), views: item.metric || '',
    badgeSubtitle: item.metadata.statusText || '', date: item.dateLabel || '',
    actionText: 'Lire le reportage', sector: item.section === 'home' ? 'humanitaire' : item.section,
    stats: item.metadata.impactBox || item.metric, statsIcon: item.metadata.statsIcon,
  };
}

type State = {
  get: <T = unknown>(key: keyof ContentMap) => T;
  media: (section: MediaItem['section']) => VideoItem[];
  mediaItems: MediaItem[];
  status: ContentStatus;
  refresh: () => Promise<void>;
};

const Context = createContext<State | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<Partial<ContentMap>>(() => {
    return Object.fromEntries(DEFAULT_CONTENT_PAYLOAD.blocks.map((block) => [block.key, block.data])) as Partial<ContentMap>;
  });
  const [items, setItems] = useState<MediaItem[]>(() => {
    return DEFAULT_CONTENT_PAYLOAD.mediaItems.filter((item) => item.isActive).sort((a, b) => a.order - b.order);
  });
  const [status, setStatus] = useState<ContentStatus>('loading');
  const refresh = useCallback(async () => {
    setStatus('loading');
    try {
      const payload = await contentApi.public();
      const required = ['site.brand', 'site.navigation', 'site.footer', 'site.contact', 'site.profile', 'site.guide', 'site.donation', 'site.search', 'home.page', 'agriculture.page', 'elevage.page', 'humanitaire.page'];
      if (!required.every((key) => payload.blocks.some((block) => block.key === key))) throw new Error('Le contenu initial est incomplet');
      setBlocks(Object.fromEntries(payload.blocks.map((block) => [block.key, block.data])) as Partial<ContentMap>);
      setItems(payload.mediaItems.filter((item) => item.isActive).sort((a, b) => a.order - b.order));
      setStatus('loaded');
    } catch (cause) {
      console.error('[content] Chargement impossible, utilisation du contenu local', cause);
      const fallback = getLocalPayload();
      const defaults = Object.fromEntries(DEFAULT_CONTENT_PAYLOAD.blocks.map(block => [block.key, block.data]));
      setBlocks({ ...defaults, ...Object.fromEntries(fallback.blocks.map(block => [block.key, block.data])) } as Partial<ContentMap>);
      setItems(fallback.mediaItems.filter(item => item.isActive).sort((a, b) => a.order - b.order));
      setStatus('degraded');
    }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const value = useMemo<State>(() => ({
    get: (key) => blocks[key] as never,
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

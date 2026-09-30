import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AGRICULTURE_DATA, ELEVAGE_DATA, HUMANITAIRE_DATA, HOME_CONTENT, HOME_METRICS, HOME_VIDEOS, SITE_CONTENT } from '../../data/content';
import { contentApi, MediaItem } from '../../services/contentApi';
const fallbacks: Record<string, any> = { 'site.brand': SITE_CONTENT.brand, 'site.footer': SITE_CONTENT.footer, 'site.contact': SITE_CONTENT.contact, 'site.profile': SITE_CONTENT.profile, 'site.guide': SITE_CONTENT.guide, 'home.page': { ...HOME_CONTENT, metrics: HOME_METRICS }, 'agriculture.page': AGRICULTURE_DATA, 'elevage.page': ELEVAGE_DATA, 'humanitaire.page': HUMANITAIRE_DATA };
function legacy(item: MediaItem): any { return { ...(item.metadata || {}), id: item.slug, title: item.title, description: item.description, summary: item.description, fullText: item.body, image: item.imageUrl, alt: item.imageAlt, badge: item.badge, tag: item.badge, tagLabel: item.badge, date: item.dateLabel, statMetric: item.metric, stats: item.metric, btnText: item.buttonLabel, actionText: item.buttonLabel, category: item.metadata?.category || 'all', duration: item.metadata?.duration || '', tagIcon: item.metadata?.tagIcon || 'article', badgeIcon: item.metadata?.badgeIcon || 'article', statsIcon: item.metadata?.statsIcon || 'verified', progress: '', sector: item.section }; }
type State = { get: <T = any>(key: string) => T; media: (section: string) => any[]; refresh: () => Promise<void> };
const Context = createContext<State>({ get: (key) => fallbacks[key], media: (section) => section === 'home' ? HOME_VIDEOS : fallbacks[`${section}.page`]?.videos || [], refresh: async () => {} });
export function ContentProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<Record<string, any>>({}); const [items, setItems] = useState<MediaItem[]>([]);
  const refresh = async () => { try { const payload = await contentApi.public(); setBlocks(Object.fromEntries(payload.blocks.map((b) => [b.key, b.data]))); setItems(payload.mediaItems); } catch { /* fallback de disponibilité uniquement */ } };
  useEffect(() => { void refresh(); }, []);
  const value = useMemo<State>(() => ({ get: (key) => ({ ...(fallbacks[key] || {}), ...(blocks[key] || {}) }), media: (section) => { const remote = items.filter((i) => i.section === section && i.isActive).sort((a, b) => a.order - b.order).map(legacy); return remote.length ? remote : section === 'home' ? HOME_VIDEOS : fallbacks[`${section}.page`]?.videos || []; }, refresh }), [blocks, items]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useContent = () => useContext(Context);

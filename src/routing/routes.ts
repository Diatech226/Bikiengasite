import type { TabType } from '../types';

export const tabPath = (tab: TabType) => tab === 'accueil' ? '/' : `/${tab}`;
export const itemPath = (kind: 'articles' | 'reportages', slug: string) => `/${kind}/${encodeURIComponent(slug)}`;
export type Route = { tab: TabType; kind?: 'articles' | 'reportages'; slug?: string; notFound?: boolean };
export function parseRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/' || path === '/accueil') return { tab: 'accueil' };
  if (/^\/(agriculture|elevage|humanitaire|projets|admin)$/.test(path)) return { tab: path.slice(1) as TabType };
  const match = path.match(/^\/(articles|reportages)\/([^/]+)$/);
  if (match) {
    try { return { tab: 'accueil', kind: match[1] as 'articles' | 'reportages', slug: decodeURIComponent(match[2]) }; }
    catch { /* A malformed encoded URL is a missing page. */ }
  }
  return { tab: 'accueil', notFound: true };
}

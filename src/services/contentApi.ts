import { apiRequest } from './api';

export type ContentStatus = 'loading' | 'loaded' | 'error';
export interface LabelValue { value: string; label: string }
export interface NavigationItem { id: 'accueil'|'agriculture'|'elevage'|'humanitaire'; label: string; footerLabel: string }
export interface SiteBrandContent { name: string; subtitle: string; logoUrl: string; logoAlt: string }
export interface SiteNavigationContent { items: NavigationItem[]; searchLabel: string; supportLabel: string; profileLabel: string }
export interface SiteFooterContent { description: string; navigationTitle: string; supportTitle: string; supportDescription: string; donationButton: string; profileButton: string; copyright: string; signature: string }
export interface SiteProfileContent { name: string; title: string; biography: string; quote: string; imageUrl: string; imageAlt: string; buttonLabel: string }
export interface SiteDonationContent { badge: string; eyebrow: string; title: string; introduction: string; projectLabel: string; nameLabel: string; namePlaceholder: string; contactLabel: string; contactPlaceholder: string; emailLabel: string; emailPlaceholder: string; amountLabel: string; messageLabel: string; messagePlaceholder: string; submitLabel: string; successBadge: string; successTitle: string; successMessage: string; categories: LabelValue[]; suggestedAmounts: { value: number; label: string }[] }
export interface SiteSearchContent { placeholder: string; suggestionsTitle: string; mediaTitle: string; articlesTitle: string; emptyMessage: string; suggestions: string[] }
export interface FilterContent { id: string; label: string; icon?: string }
export interface HeaderContent { badge: string; title: string; description: string; quote?: string; author?: string }
export interface StatContent { value: string; label: string; sub?: string; sublabel?: string; icon?: string; color?: string; bg?: string; bgColor?: string; textColor?: string }
export interface HomePageContent {
  badge: string; title: string; description: string; primaryButton: string; secondaryButton: string;
  quote: string; quoteAuthor: string; quoteCaption: string; impactTitle: string; impactPeriod: string;
  metrics: StatContent[]; filters: FilterContent[]; storiesTitle: string; articlesEyebrow: string; articlesHeading: string;
  articlesMoreLabel: string; upcomingTitle: string; upcomingEyebrow: string; upcomingDescription: string;
  upcomingPrimaryButton: string; upcomingSecondaryButton: string; emptyArticlesTitle: string; emptyArticlesDescription: string;
  emptyArticlesButton: string; featuredLabel: string; articleReadLabel: string; articlesLoadingLabel: string;
  articlesErrorLabel: string; retryLabel: string;
}
export interface SectionPageContent {
  header: HeaderContent; stats: StatContent[]; filters?: FilterContent[]; [key: string]: unknown;
}
export interface ContentMap {
  'site.brand': SiteBrandContent; 'site.navigation': SiteNavigationContent; 'site.footer': SiteFooterContent;
  'site.contact': Record<string,string>; 'site.profile': SiteProfileContent; 'site.guide': Record<string,unknown>;
  'site.donation': SiteDonationContent; 'site.search': SiteSearchContent;
  'home.page': HomePageContent; 'agriculture.page': SectionPageContent; 'elevage.page': SectionPageContent; 'humanitaire.page': SectionPageContent;
}
export interface ContentBlock<K extends keyof ContentMap = keyof ContentMap> { id?: string; key: K; section: string; data: ContentMap[K]; updatedAt?: string }
export interface MediaMetadata { duration?: string; category?: string; tagIcon?: string; badgeIcon?: string; statsIcon?: string; location?: string; statusText?: string; expandedNarrative?: string; impactBox?: string }
export interface MediaItem { id?: string; slug: string; section: 'home'|'agriculture'|'elevage'|'humanitaire'; type: 'reportage'|'chronique'|'projet'; title: string; description: string; body?: string; imageUrl?: string; imageAlt?: string; badge?: string; dateLabel?: string; metric?: string; buttonLabel?: string; metadata: MediaMetadata; order: number; isActive: boolean }
export interface ContentPayload { blocks: ContentBlock[]; mediaItems: MediaItem[] }
export const contentApi = {
  public: () => apiRequest<ContentPayload>('/content'), admin: () => apiRequest<ContentPayload>('/admin/content'),
  update: <K extends keyof ContentMap>(key: K, data: ContentMap[K]) => apiRequest<ContentBlock<K>>(`/admin/content/${encodeURIComponent(key)}`, { method: 'PATCH', body: JSON.stringify({ data }) }),
  createMedia: (item: MediaItem) => { const { id: _id, slug, ...payload } = item; return apiRequest<MediaItem>('/admin/media-items', { method: 'POST', body: JSON.stringify(slug ? { ...payload, slug } : payload) }); },
  updateMedia: (id: string, item: MediaItem) => apiRequest<MediaItem>(`/admin/media-items/${id}`, { method: 'PATCH', body: JSON.stringify(item) }),
  deleteMedia: (id: string) => apiRequest<{success:boolean}>(`/admin/media-items/${id}`, { method: 'DELETE' }),
};

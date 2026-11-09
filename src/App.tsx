import { articleApi } from './services/articleApi';
import { parseRoute, tabPath, itemPath } from './routing/routes';
import { toVideo } from './features/content/ContentContext';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { ArticleModal } from './components/ArticleModal';
import { AgriculturalGuideModal } from './components/AgriculturalGuideModal';
import { DonationModal } from './components/DonationModal';
import { SearchModal } from './components/SearchModal';
import { ProfileModal } from './components/ProfileModal';
import { BookmarksModal } from './components/BookmarksModal';

import { HomeScreen } from './screens/HomeScreen';
import { AgricultureScreen } from './screens/AgricultureScreen';
import { ElevageScreen } from './screens/ElevageScreen';
import { HumanitaireScreen } from './screens/HumanitaireScreen';
import { ProjetsScreen } from './screens/ProjetsScreen';
import { AdminScreen } from './features/admin/AdminScreen';
import { ArticleItem, TabType, VideoItem } from './types';
import { useToast } from './hooks/useToast';
import { useArticles } from './features/articles/hooks/useArticles';
import { useBookmarks } from './features/bookmarks/hooks/useBookmarks';
import { useContent } from './features/content/ContentContext';
import { SiteBrandContent, SiteContactContent, SiteFooterContent, SiteNavigationContent } from './services/contentApi';

export default function App() {
  const { get, mediaItems, status: contentStatus, refresh: refreshContent } = useContent();
  const brand = get<SiteBrandContent>('site.brand');
  const footer = get<SiteFooterContent>('site.footer');
  const contact = get<SiteContactContent>('site.contact');
  const navigation = get<SiteNavigationContent>('site.navigation');
  const [pathname, setPathname] = useState(window.location.pathname);
  const [previewArticle, setPreviewArticle] = useState<ArticleItem | null>(null);
  const route = parseRoute(pathname);
  const currentTab = route.tab;
  const navigate = (path: string, reader = false, replace = false) => {
    if (path === pathname && !replace) return;
    window.history[replace ? 'replaceState' : 'pushState']({ reader, returnPath: tabPath(currentTab) }, '', path);
    setPathname(window.location.pathname);
    setPreviewArticle(null);
    setIsSearchOpen(false);
    setIsBookmarksOpen(false);
  };
  const setCurrentTab = (tab: TabType) => navigate(tabPath(tab));
  const setActiveVideo = (video: VideoItem | null) => {
    if (video) navigate(itemPath('reportages', video.slug || video.id), true);
    else closeReader();
  };
  const setActiveArticle = (article: ArticleItem | null) => {
    if (!article) { setPreviewArticle(null); if (route.kind) closeReader(); }
    else if (currentTab === 'admin') setPreviewArticle(article);
    else navigate(itemPath('articles', article.slug || article.id), true);
  };
  const closeReader = () => {
    if (window.history.state?.reader) window.history.back();
    else navigate('/', false, true);
  };
  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname);
      setPreviewArticle(null);
      setIsSearchOpen(false); setIsBookmarksOpen(false); setIsDonationOpen(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [donationCategory, setDonationCategory] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  const handleOpenDonation = (category?: string) => {
    setDonationCategory(category);
    setIsDonationOpen(true);
  };

  const { message: toastMessage, showToast } = useToast();
  const { bookmarks, toggleBookmark: handleToggleBookmark } = useBookmarks(showToast);
  const { articles, loading: articlesLoading, error: articlesError, refresh: refreshArticles } = useArticles();

  const [detailRetry, setDetailRetry] = useState(0);
  const [articleDetail, setArticleDetail] = useState<{ slug: string; article?: ArticleItem; error?: boolean } | null>(null);
  useEffect(() => {
    if (route.kind !== 'articles' || !route.slug) return;
    const slug = route.slug;
    const controller = new AbortController();
    void articleApi.public.bySlug(slug, controller.signal).then(article => {
      if (!controller.signal.aborted) setArticleDetail({ slug, article });
    }).catch(cause => {
      if (controller.signal.aborted) return;
      console.error('[article] Chargement du lien direct impossible', cause);
      setArticleDetail({ slug, error: true });
    });
    return () => controller.abort();
  }, [route.kind, route.slug, detailRetry]);
  const detailLoading = route.kind === 'articles' && articleDetail?.slug !== route.slug;
  const detailError = route.kind === 'articles' && articleDetail?.slug === route.slug && articleDetail?.error;
  const activeVideo = route.kind === 'reportages'
    ? mediaItems.map(toVideo).find(item => item.slug === route.slug || item.id === route.slug) || null : null;
  const activeArticle = previewArticle || (route.kind === 'articles'
    ? (articleDetail?.slug === route.slug ? articleDetail?.article : null) || articles.find(item => item.slug === route.slug || item.id === route.slug) || null : null);
  const missingItem = route.kind && !activeVideo && !activeArticle && contentStatus !== 'loading' && !articlesLoading && !detailLoading;

  // Scroll to top on tab change (called unconditionally before early returns)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleShare = (title: string, desc: string) => {
    if (navigator.share) {
      navigator
        .share({
          title,
          text: desc,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${title} - ${window.location.href}`);
        showToast('Lien copié dans le presse-papier !');
      } else {
        showToast('Lien de partage disponible');
      }
    }
  };



  return (
    <div className="min-h-screen bg-[#f8fbf9] flex flex-col text-[#151d1a] selection:bg-[#ffca98] selection:text-[#7a532a]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        savedCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenDonation={() => setCurrentTab('projets')}
      />

      {/* Main Responsive Content Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 pb-24 md:pb-12">
        <main className="w-full">
          {(contentStatus === 'degraded' || articlesError || detailError) && <aside role="status" className="mb-4 rounded-lg border border-amber-700 bg-amber-50 p-4 text-sm text-amber-950">
            <p>Mode dégradé : des contenus locaux de secours sont affichés. Ils peuvent être anciens.</p>
            <button className="underline mt-2" onClick={() => { void refreshContent(); void refreshArticles(); setDetailRetry(value => value + 1); }}>Réessayer le chargement</button>
          </aside>}
          {detailLoading && !activeArticle && <p role="status">Chargement de l’article…</p>}
          {(route.notFound || missingItem) && <section className="public-hero"><h1>{detailError ? "Article indisponible" : "Page introuvable"}</h1><p>{detailError ? "Impossible de charger cet article pour le moment. Réessayez lorsque la connexion au serveur sera rétablie." : "Ce lien ne correspond à aucun contenu disponible."}</p><a href="/" onClick={e => { e.preventDefault(); setCurrentTab('accueil'); }}>Retour à l’accueil</a></section>}
          {currentTab === 'accueil' && !route.notFound && !route.kind && (
            <HomeScreen
              articles={articles}
              onOpenVideo={(v) => setActiveVideo(v)}
              onOpenArticle={(a) => setActiveArticle(a)}
              onOpenDonation={() => setCurrentTab('projets')}
              onNavigateToProjects={() => setCurrentTab('projets')}
              articlesLoading={articlesLoading}
              articlesError={articlesError}
              onRetryArticles={() => void refreshArticles()}
            />
          )}

          {currentTab === 'projets' && (
            <ProjetsScreen
              onSelectProject={(category) => handleOpenDonation(category)}
              onBackToHome={() => setCurrentTab('accueil')}
            />
          )}

          {currentTab === 'agriculture' && (
            <AgricultureScreen
              onOpenVideo={(v) => setActiveVideo(v)}
              onOpenGuide={() => setIsGuideOpen(true)}
            />
          )}

          {currentTab === 'elevage' && (
            <ElevageScreen
              onOpenVideo={(v) => setActiveVideo(v)}
              onOpenDonation={() => handleOpenDonation()}
            />
          )}

          {currentTab === 'humanitaire' && (
            <HumanitaireScreen
              onOpenVideo={(v) => setActiveVideo(v)}
              onOpenDonation={() => setCurrentTab('projets')}
            />
          )}

          {currentTab === 'admin' && (
            <AdminScreen
              onPreviewArticle={(art) => setActiveArticle(art)}
              onExitAdmin={() => {
                setCurrentTab('accueil');
                void refreshArticles();
                void refreshContent();
              }}
            />
          )}
        </main>
      </div>

      {/* Responsive Desktop & Tablet Footer */}
      <footer className="w-full bg-[#012d1d] text-white border-t border-[#02442c] mb-20 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: Brand & Cheick Vision */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={brand.logoUrl}
                  alt={brand.logoAlt}
                  className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-headline-sm text-lg font-bold text-white tracking-tight">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-[#c1ecd4]">
                    {brand.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#ffdcbd]">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                <span>{contact.location}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#dce5de]">
                <a className="hover:text-white" href={`mailto:${contact.email}`}>{contact.email}</a>
                <a className="hover:text-white" href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
              </div>
            </div>

            {/* Col 2: Navigation rapide */}
            <div className="flex flex-col gap-3">
              <h4 className="font-label-md text-sm font-bold uppercase tracking-wider text-[#ffca98]">
                {footer.navigationTitle}
              </h4>
              <nav aria-label="Navigation de pied de page" className="flex flex-col gap-2">
                {navigation.items.map(item => <a key={item.id} href={tabPath(item.id)} onClick={e => { e.preventDefault(); setCurrentTab(item.id); }}>{item.footerLabel || item.label}</a>)}
                <a href="/projets" onClick={e => { e.preventDefault(); setCurrentTab('projets'); }}>Projets</a>
                <a href="/admin" onClick={e => { e.preventDefault(); setCurrentTab('admin'); }}>Administration</a>
              </nav>
            </div>

            {/* Col 3: Engagement & Contact */}
            <div className="flex flex-col gap-3">
              <h4 className="font-label-md text-sm font-bold uppercase tracking-wider text-[#ffca98]">
                {footer.supportTitle}
              </h4>
              <div className="flex flex-col gap-2 mt-1">
                <button
                  onClick={() => setIsDonationOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#ffca98] text-[#2c1600] text-xs font-bold hover:bg-[#ffdcbd] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                  <span>{footer.donationButton}</span>
                </button>

                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#dce5de] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span>{footer.profileButton}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-xs text-[#dce5de]/70">
            <p>{footer.copyright}</p>
          </div>
        </div>
      </footer>

      {/* Bottom Tab Navigation - Mobile Only */}
      <BottomNav currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)} />


        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#012d1d] text-white text-xs font-semibold shadow-lg flex items-center gap-2 border border-[#c1ecd4]/30 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <span className="material-symbols-outlined text-[18px] text-[#ffca98]">
              check_circle
            </span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Video Player Modal */}
        {activeVideo && (
          <VideoPlayerModal
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
            isBookmarked={bookmarks.includes(activeVideo.id)}
            onToggleBookmark={handleToggleBookmark}
            onShare={handleShare}

          />
        )}

        {/* Article Reader Modal */}
        {activeArticle && (
          <ArticleModal
            article={activeArticle}
            onClose={() => setActiveArticle(null)}
            isBookmarked={bookmarks.includes(activeArticle.id)}
            onToggleBookmark={handleToggleBookmark}
            onShare={handleShare}
          />
        )}

        {/* Practical Agricultural Guide Modal */}
        {isGuideOpen && (
          <AgriculturalGuideModal onClose={() => setIsGuideOpen(false)} />
        )}

        {/* Donation / Support Modal */}
        {isDonationOpen && (
          <DonationModal
            onClose={() => {
              setIsDonationOpen(false);
              setDonationCategory(undefined);
            }}
            defaultCategory={donationCategory}
          />
        )}

        {/* Search Modal */}
        {isSearchOpen && (
          <SearchModal
            articles={articles}
            onClose={() => setIsSearchOpen(false)}
            onSelectVideo={(v) => setActiveVideo(v)}
            onSelectArticle={(a) => setActiveArticle(a)}
          />
        )}

        {/* Profile Modal */}
        {isProfileOpen && (
          <ProfileModal
            onClose={() => setIsProfileOpen(false)}
            onOpenDonation={() => {
              setIsProfileOpen(false);
              setIsDonationOpen(true);
            }}
          />
        )}

        {/* Bookmarks Modal */}
        {isBookmarksOpen && (
          <BookmarksModal
            articles={articles}
            onClose={() => setIsBookmarksOpen(false)}
            bookmarks={bookmarks}
            onRemoveBookmark={(id) => handleToggleBookmark(id, '')}
            onSelectVideo={(v) => setActiveVideo(v)}
            onSelectArticle={(a) => setActiveArticle(a)}
          />
        )}
    </div>
  );
}

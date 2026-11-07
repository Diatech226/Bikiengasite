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
import { AdminScreen } from './features/admin/AdminScreen';
import { ArticleItem, TabType, VideoItem } from './types';
import { useToast } from './hooks/useToast';
import { useArticles } from './features/articles/hooks/useArticles';
import { useBookmarks } from './features/bookmarks/hooks/useBookmarks';
import { useContent } from './features/content/ContentContext';
import { SiteBrandContent, SiteContactContent, SiteFooterContent, SiteNavigationContent } from './services/contentApi';

export default function App() {
  const { get, status: contentStatus, refresh: refreshContent } = useContent();
  const brand = get<SiteBrandContent>('site.brand');
  const footer = get<SiteFooterContent>('site.footer');
  const contact = get<SiteContactContent>('site.contact');
  const navigation = get<SiteNavigationContent>('site.navigation');
  const [currentTab, setCurrentTab] = useState<TabType>('accueil');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [donationContext, setDonationContext] = useState<{ category?: string; message?: string }>({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  const { message: toastMessage, showToast } = useToast();
  const { bookmarks, toggleBookmark: handleToggleBookmark } = useBookmarks(showToast);
  const { articles, loading: articlesLoading, error: articlesError, refresh: refreshArticles } = useArticles();

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

  if (contentStatus === 'loading') return <div className="min-h-screen grid place-items-center bg-[#f8fbf9]" role="status">Chargement du contenu…</div>;
  if (contentStatus === 'error') return <div className="min-h-screen grid place-items-center bg-[#f8fbf9]"><div className="text-center"><p>Le contenu est momentanément indisponible.</p><button className="mt-4 px-4 py-2 rounded-full bg-[#012d1d] text-white" onClick={() => void refreshContent()}>Réessayer</button></div></div>;


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
        onOpenDonation={() => setIsDonationOpen(true)}
      />

      {/* Main Responsive Content Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 pb-24 md:pb-12">
        <main className="w-full">
          {currentTab === 'accueil' && (
            <HomeScreen
              articles={articles}
              onOpenVideo={(v) => setActiveVideo(v)}
              onOpenArticle={(a) => setActiveArticle(a)}
              onOpenDonation={() => setIsDonationOpen(true)}
              onParticipateProject={(project) => {
                const category = project.sector === 'agriculture' ? 'arbres' : project.sector === 'elevage' ? 'materiel' : 'forage';
                setDonationContext({ category, message: `Participation au chantier : ${project.title}` });
                setIsDonationOpen(true);
              }}
              articlesLoading={articlesLoading}
              articlesError={articlesError}
              onRetryArticles={() => void refreshArticles()}
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
              onOpenDonation={() => setIsDonationOpen(true)}
            />
          )}

          {currentTab === 'humanitaire' && (
            <HumanitaireScreen
              onOpenVideo={(v) => setActiveVideo(v)}
              onOpenDonation={() => setIsDonationOpen(true)}
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
      <footer className="w-full bg-[#012d1d] text-white border-t border-[#02442c] hidden md:block">
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
              <p className="text-sm text-[#dce5de] leading-relaxed max-w-md">
                {footer.description}
              </p>
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
              <ul className="flex flex-col gap-2 text-sm text-[#dce5de]">
                <li>
                  <button
                    onClick={() => setCurrentTab('accueil')}
                    className="hover:text-white transition-colors"
                  >
                    {navigation.items.find((item) => item.id === 'accueil')?.footerLabel}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('agriculture')}
                    className="hover:text-white transition-colors"
                  >
                    {navigation.items.find((item) => item.id === 'agriculture')?.footerLabel}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('elevage')}
                    className="hover:text-white transition-colors"
                  >
                    {navigation.items.find((item) => item.id === 'elevage')?.footerLabel}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('humanitaire')}
                    className="hover:text-white transition-colors"
                  >
                    {navigation.items.find((item) => item.id === 'humanitaire')?.footerLabel}
                  </button>
                </li>

              </ul>
            </div>

            {/* Col 3: Engagement & Contact */}
            <div className="flex flex-col gap-3">
              <h4 className="font-label-md text-sm font-bold uppercase tracking-wider text-[#ffca98]">
                {footer.supportTitle}
              </h4>
              <p className="text-xs text-[#dce5de] leading-relaxed">
                {footer.supportDescription}
              </p>
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

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#dce5de]/70 gap-4">
            <p>{footer.copyright}</p>
            <div className="flex items-center gap-4">
              <span>{footer.signature}</span>
            </div>
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
            onReadArticle={(v) => {
              setActiveArticle({
                id: v.id,
                title: v.title,
                date: v.date,
                readTime: v.duration,
                image: v.image,
                alt: v.alt,
                excerpt: v.summary,
                fullText: v.fullText || v.summary,
                category: v.tagLabel,
              });
            }}
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
          <DonationModal defaultCategory={donationContext.category} defaultMessage={donationContext.message} onClose={() => { setIsDonationOpen(false); setDonationContext({}); }} />
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

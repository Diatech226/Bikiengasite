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

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('accueil');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  const { message: toastMessage, showToast } = useToast();
  const { bookmarks, toggleBookmark: handleToggleBookmark } = useBookmarks(showToast);
  const { articles, loading: articlesLoading, error: articlesError, refresh: refreshArticles } = useArticles();

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

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

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
              onOpenAdmin={() => setCurrentTab('admin')}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onShare={handleShare}
              articlesLoading={articlesLoading}
              articlesError={articlesError}
              onRetryArticles={() => void refreshArticles()}
            />
          )}

          {currentTab === 'agriculture' && (
            <AgricultureScreen
              onOpenVideo={(v) => setActiveVideo(v)}
              onOpenArticle={(a) => setActiveArticle(a)}
              onOpenGuide={() => setIsGuideOpen(true)}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {currentTab === 'elevage' && (
            <ElevageScreen
              onOpenVideo={(v) => setActiveVideo(v)}
              onOpenArticle={(a) => setActiveArticle(a)}
              onOpenDonation={() => setIsDonationOpen(true)}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {currentTab === 'humanitaire' && (
            <HumanitaireScreen
              onOpenVideo={(v) => setActiveVideo(v)}
              onOpenArticle={(a) => setActiveArticle(a)}
              onOpenDonation={() => setIsDonationOpen(true)}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onShare={handleShare}
            />
          )}

          {currentTab === 'admin' && (
            <AdminScreen
              onPreviewArticle={(art) => setActiveArticle(art)}
              onExitAdmin={() => {
                setCurrentTab('accueil');
                void refreshArticles();
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
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VQGm1R3RM"
                  alt="Sillon Sahélien Logo"
                  className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-headline-sm text-lg font-bold text-white tracking-tight">
                    Sillon Sahélien
                  </h3>
                  <p className="text-xs text-[#c1ecd4]">
                    Nagréogo & Cheick Bikienga Seydou
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#dce5de] leading-relaxed max-w-md">
                Plateforme officielle de valorisation agro-écologique, pastorale et humanitaire du village de Nagréogo (Burkina Faso). Allier tradition sahélienne, science régénérative et solidarité fraternelle.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#ffdcbd]">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                <span>Nagréogo, Région du Plateau-Central, Burkina Faso</span>
              </div>
            </div>

            {/* Col 2: Navigation rapide */}
            <div className="flex flex-col gap-3">
              <h4 className="font-label-md text-sm font-bold uppercase tracking-wider text-[#ffca98]">
                Pôles d'Action
              </h4>
              <ul className="flex flex-col gap-2 text-sm text-[#dce5de]">
                <li>
                  <button
                    onClick={() => setCurrentTab('accueil')}
                    className="hover:text-white transition-colors"
                  >
                    Accueil & Échos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('agriculture')}
                    className="hover:text-white transition-colors"
                  >
                    Pôle Agricole & Zaï
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('elevage')}
                    className="hover:text-white transition-colors"
                  >
                    Pôle Pastoral & Élevage
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('humanitaire')}
                    className="hover:text-white transition-colors"
                  >
                    Œuvres Humanitaires & Eau
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('admin')}
                    className="hover:text-[#ffca98] transition-colors flex items-center gap-1.5 font-medium"
                  >
                    <span>Espace Rédaction & Blog</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#ffca98]/20 text-[#ffca98] rounded-full">Admin</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Engagement & Contact */}
            <div className="flex flex-col gap-3">
              <h4 className="font-label-md text-sm font-bold uppercase tracking-wider text-[#ffca98]">
                Soutien & Fraternité
              </h4>
              <p className="text-xs text-[#dce5de] leading-relaxed">
                Soutenez les forages, les arbres et les semences paysannes locales par un don ou en contactant le secrétariat.
              </p>
              <div className="flex flex-col gap-2 mt-1">
                <button
                  onClick={() => setIsDonationOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#ffca98] text-[#2c1600] text-xs font-bold hover:bg-[#ffdcbd] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                  <span>Faire un don aux œuvres</span>
                </button>
                <button
                  onClick={() => setCurrentTab('admin')}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-[#ffca98] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  <span>Gérer le blog (Admin)</span>
                </button>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#dce5de] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span>Biographie du Cheick</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#dce5de]/70 gap-4">
            <p>© 2024-2026 Sillon Sahélien • Cheick Bikienga Seydou — Nagréogo. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <span>Agro-écologie • Pâturage régénératif • Fraternité</span>
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
          <DonationModal onClose={() => setIsDonationOpen(false)} />
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

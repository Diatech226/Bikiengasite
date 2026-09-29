import React from 'react';
import { APP_ASSETS } from '../data/content';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  savedCount: number;
  onOpenBookmarks: () => void;
  onOpenDonation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenSearch,
  onOpenProfile,
  savedCount,
  onOpenBookmarks,
  onOpenDonation,
}) => {
  const titles: Record<TabType, string> = {
    accueil: 'Accueil',
    agriculture: 'Agriculture',
    elevage: 'Élevage',
    humanitaire: 'Humanitaire',
    admin: 'Administration',
  };

  const navItems: { tab: TabType; label: string; icon: string }[] = [
    { tab: 'accueil', label: 'Accueil', icon: 'home' },
    { tab: 'agriculture', label: 'Agriculture', icon: 'eco' },
    { tab: 'elevage', label: 'Élevage', icon: 'cruelty_free' },
    { tab: 'humanitaire', label: 'Humanitaire', icon: 'volunteer_activism' },
  ];

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#f3fbf5]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.05)] border-b border-[#e2eae4]">
      <div className="max-w-7xl mx-auto h-16 md:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div
          onClick={() => onTabChange('accueil')}
          className="flex items-center gap-3 min-w-0 cursor-pointer group"
        >
          <img
            alt="Logo Nagreogo Cheick Bikienga"
            className="h-9 md:h-11 w-auto object-contain flex-shrink-0 transition-transform group-hover:scale-105"
            src={APP_ASSETS.logo}
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-[0.6875rem] md:text-xs font-bold tracking-wider uppercase text-[#7d562d] truncate">
              Nagréogo • Cheick Bikienga
            </span>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-[1.125rem] md:text-xl text-[#012d1d] font-bold truncate leading-tight">
                Sillon Sahélien
              </span>
              <span className="hidden sm:inline-block md:hidden text-xs px-2 py-0.5 rounded-full bg-[#e2eae4] text-[#012d1d] font-semibold">
                {titles[currentTab]}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onTabChange(item.tab)}
                className={`flex items-center gap-2 px-3.5 lg:px-4 py-2 rounded-full font-label-md text-sm transition-all ${
                  isActive
                    ? 'bg-[#012d1d] text-white shadow-sm font-bold'
                    : 'text-[#414844] hover:text-[#012d1d] hover:bg-[#e7f0ea] font-medium'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[19px]"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Rechercher"
            className="w-10 h-10 md:w-auto md:px-3.5 md:py-2 flex items-center justify-center gap-2 rounded-full text-[#414844] hover:text-[#012d1d] hover:bg-[#e2eae4] transition-colors border border-transparent md:border-[#c1c8c2]/50"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
            <span className="hidden lg:inline text-xs font-medium text-[#717973]">
              Rechercher...
            </span>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            aria-label="Articles et vidéos enregistrés"
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#414844] hover:text-[#012d1d] hover:bg-[#e2eae4] transition-colors"
            title="Mes enregistrements"
          >
            <span className="material-symbols-outlined text-[20px]">
              {savedCount > 0 ? 'bookmark' : 'bookmark_border'}
            </span>
            {savedCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#7d562d] text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          {/* Desktop Direct CTA Button */}
          <button
            onClick={onOpenDonation}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ffca98] text-[#7a532a] font-label-md text-xs lg:text-sm font-bold shadow-xs hover:bg-[#f0bd8b] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[17px]">volunteer_activism</span>
            <span>Soutenir l'action</span>
          </button>

          {/* Admin / Editorial Studio Button */}
          <button
            onClick={() => onTabChange(currentTab === 'admin' ? 'accueil' : 'admin')}
            aria-label="Administration du Blog"
            className={`flex items-center gap-1.5 px-3 py-1.5 md:py-2 rounded-full text-xs font-semibold transition-all ${
              currentTab === 'admin'
                ? 'bg-[#012d1d] text-[#ffca98] ring-2 ring-[#ffca98] shadow-sm'
                : 'text-[#414844] hover:text-[#012d1d] hover:bg-[#e2eae4] border border-[#c1c8c2]/50'
            }`}
            title="Administration & Gestion du Blog"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: currentTab === 'admin' ? "'FILL' 1" : "'FILL' 0" }}
            >
              admin_panel_settings
            </span>
            <span className="hidden md:inline">Admin Blog</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            aria-label="Profil de Cheick Bikienga"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:ring-2 hover:ring-[#7d562d] transition-all p-0.5"
            title="Notice biographique du Cheick"
          >
            <img
              alt="Profile Cheick Bikienga"
              className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shadow-xs border border-[#ffca98]"
              src={APP_ASSETS.profile}
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
};


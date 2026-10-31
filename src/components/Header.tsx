import React from 'react';
import { useContent } from '../features/content/ContentContext';
import { SiteBrandContent, SiteNavigationContent, SiteProfileContent } from '../services/contentApi';
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
  const { get } = useContent();
  const brand = get<SiteBrandContent>('site.brand'); const navigation = get<SiteNavigationContent>('site.navigation'); const profile = get<SiteProfileContent>('site.profile');
  const icons = { accueil: 'home', agriculture: 'eco', elevage: 'cruelty_free', humanitaire: 'volunteer_activism' } as const;
  const navItems = (navigation.items || []).map((item) => ({ tab: item.id, label: item.label, icon: icons[item.id] }));

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#f3fbf5]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.05)] border-b border-[#e2eae4]">
      <div className="max-w-7xl mx-auto h-16 md:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <button type="button"
          onClick={() => onTabChange('accueil')}
          aria-label="Retour à l’accueil"
          className="flex items-center gap-2 sm:gap-3 min-w-0 text-left group"
        >
          <img
            alt={brand.logoAlt || ''}
            className="h-9 md:h-11 w-auto object-contain flex-shrink-0 transition-transform group-hover:scale-105"
            src={brand.logoUrl}
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col min-w-0">
            <span className="brand-subtitle font-label-sm text-[0.6875rem] md:text-xs font-bold tracking-wider uppercase text-[#7d562d] truncate">
              {brand.subtitle}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-[1.125rem] md:text-xl text-[#012d1d] font-bold truncate leading-tight">
                {brand.name}
              </span>
            </div>
          </div>
        </button>

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
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            aria-label={navigation.searchLabel}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#414844] hover:text-[#012d1d] hover:bg-[#e2eae4] transition-colors"
            title={navigation.searchLabel}
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            aria-label="Articles et reportages enregistrés"
            className="relative hidden sm:flex w-10 h-10 items-center justify-center rounded-full text-[#414844] hover:text-[#012d1d] hover:bg-[#e2eae4] transition-colors"
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
            <span>{navigation.supportLabel}</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            aria-label={navigation.profileLabel}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:ring-2 hover:ring-[#7d562d] transition-all p-0.5"
            title={navigation.profileLabel}
          >
            <img
              alt={profile.imageAlt || ''}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shadow-xs border border-[#ffca98]"
              src={profile.imageUrl}
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

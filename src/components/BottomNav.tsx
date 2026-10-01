import React from 'react';
import { TabType } from '../types';
import { useContent } from '../features/content/ContentContext';
import { SiteNavigationContent } from '../services/contentApi';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const { get } = useContent(); const navigation = get<SiteNavigationContent>('site.navigation');
  const icons = { accueil: 'home', agriculture: 'eco', elevage: 'cruelty_free', humanitaire: 'volunteer_activism' } as const;
  const navItems = (navigation.items || []).map((item) => ({ tab: item.id as TabType, label: item.label, icon: icons[item.id] }));

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-40 pb-safe bg-[#f3fbf5]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(27,67,50,0.08)] border-t border-[#e2eae4]">
      <div className="max-w-xl mx-auto h-18 px-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[70px] h-13 rounded-xl transition-all ${
                isActive
                  ? 'text-[#012d1d] font-bold scale-102'
                  : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px] transition-transform"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                }}
              >
                {item.icon}
              </span>
              <span className="font-label-md text-[0.75rem] tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#7d562d] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

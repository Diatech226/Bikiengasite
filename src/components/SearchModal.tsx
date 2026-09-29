import React, { useState } from 'react';
import { AGRICULTURE_DATA, ELEVAGE_DATA, HOME_ARTICLES, HOME_VIDEOS, HUMANITAIRE_DATA } from '../data/content';
import { ArticleItem, VideoItem } from '../types';

interface SearchModalProps {
  articles?: ArticleItem[];
  onClose: () => void;
  onSelectVideo: (video: VideoItem) => void;
  onSelectArticle: (article: ArticleItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  articles = HOME_ARTICLES,
  onClose,
  onSelectVideo,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');

  // Collect all searchable items
  const allVideos: VideoItem[] = [
    ...HOME_VIDEOS,
    ...AGRICULTURE_DATA.videos.map((v) => ({
      id: v.id,
      title: v.title,
      category: v.category,
      tagLabel: v.tag,
      tagIcon: v.tagIcon,
      duration: v.duration,
      views: '5k+ vues',
      date: v.date,
      image: v.image,
      alt: v.alt,
      summary: v.description,
      actionText: v.btnText,
      sector: 'agriculture' as const,
      stats: v.statMetric,
      statsIcon: v.statIcon,
    })),
    ...ELEVAGE_DATA.videos.map((v) => ({
      id: v.id,
      title: v.title,
      category: 'elevage',
      tagLabel: v.badge,
      tagIcon: v.badgeIcon,
      duration: v.duration,
      views: '6k+ vues',
      date: v.date,
      image: v.image,
      alt: v.alt,
      summary: v.description,
      actionText: v.actionText,
      sector: 'elevage' as const,
    })),
    ...HUMANITAIRE_DATA.chronicles.map((v) => ({
      id: v.id,
      title: v.title,
      category: 'humanitaire',
      tagLabel: v.badge,
      tagIcon: v.badgeIcon,
      duration: v.duration,
      views: '8k+ vues',
      date: v.location,
      image: v.image,
      alt: v.alt,
      summary: v.description,
      fullText: `${v.description}\n\n${v.expandedNarrative}\n\n${v.impactBox}`,
      actionText: 'Lire le récit',
      sector: 'humanitaire' as const,
      stats: v.statusText,
    })),
  ];

  const filteredVideos = query.trim()
    ? allVideos.filter(
        (v) =>
          v.title.toLowerCase().includes(query.toLowerCase()) ||
          v.summary.toLowerCase().includes(query.toLowerCase()) ||
          v.tagLabel.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredArticles = query.trim()
    ? articles.filter(
        (a) =>
          ((a.status || 'published') === 'published') &&
          (a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const popularSearches = ['Zaï', 'Forage solaire', 'Embouche bovine', 'Graines', 'Laiterie', 'Kits scolaires'];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-16">
      <div
        className="w-full max-w-xl bg-[#f3fbf5] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-[#c1c8c2] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="p-3 bg-white border-b border-[#dce5de] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7d562d]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (ex: Zaï, forage, lait, élevage, grain...)"
            className="flex-1 bg-transparent text-sm text-[#012d1d] font-medium placeholder-[#717973] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#717973] hover:text-[#012d1d] px-2 py-1"
            >
              Effacer
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#414844] hover:bg-[#e7f0ea]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="overflow-y-auto p-4 flex flex-col gap-4">
          {!query.trim() ? (
            <div>
              <span className="font-label-sm text-xs text-[#7d562d] font-bold uppercase tracking-wider block mb-2">
                Recherches suggérées
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-[#e7f0ea] hover:bg-[#ffca98]/40 text-[#012d1d] text-xs font-semibold transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {filteredVideos.length === 0 && filteredArticles.length === 0 && (
                <div className="text-center py-8 text-[#717973]">
                  <span className="material-symbols-outlined text-4xl text-[#c1c8c2]">
                    search_off
                  </span>
                  <p className="text-xs mt-2">Aucun résultat trouvé pour « {query} »</p>
                </div>
              )}

              {/* Videos found */}
              {filteredVideos.length > 0 && (
                <div>
                  <span className="font-label-sm text-xs font-bold text-[#7d562d] uppercase tracking-wider block mb-2">
                    Vidéos & Reportages ({filteredVideos.length})
                  </span>
                  <div className="space-y-2">
                    {filteredVideos.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => {
                          onSelectVideo(v);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-white border border-[#dce5de] hover:border-[#012d1d] flex items-center gap-3 cursor-pointer transition-all shadow-xs"
                      >
                        <div className="w-16 h-12 rounded-lg bg-black overflow-hidden relative flex-shrink-0">
                          <img
                            src={v.image}
                            alt={v.alt}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="material-symbols-outlined text-white text-[18px]">
                              play_arrow
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[10px] text-[#7d562d] font-bold uppercase">
                            {v.tagLabel} • {v.duration}
                          </span>
                          <h4 className="text-xs font-bold text-[#012d1d] truncate">
                            {v.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles found */}
              {filteredArticles.length > 0 && (
                <div>
                  <span className="font-label-sm text-xs font-bold text-[#7d562d] uppercase tracking-wider block mb-2">
                    Méditations & Enseignements ({filteredArticles.length})
                  </span>
                  <div className="space-y-2">
                    {filteredArticles.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onSelectArticle(a);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-white border border-[#dce5de] hover:border-[#7d562d] flex items-center gap-3 cursor-pointer transition-all shadow-xs"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#e7f0ea] overflow-hidden flex-shrink-0">
                          <img
                            src={a.image}
                            alt={a.alt}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[10px] text-[#7d562d] font-semibold">
                            {a.date} • {a.readTime}
                          </span>
                          <h4 className="text-xs font-bold text-[#012d1d] truncate">
                            {a.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

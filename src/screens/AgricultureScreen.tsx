import React, { useState } from 'react';
import { useContent } from '../features/content/ContentContext';
import { ArticleItem, VideoItem } from '../types';

interface AgricultureScreenProps {
  onOpenVideo: (video: VideoItem) => void;
  onOpenArticle: (article: ArticleItem) => void;
  onOpenGuide: () => void;
  bookmarks: string[];
  onToggleBookmark: (id: string, title: string) => void;
}

export const AgricultureScreen: React.FC<AgricultureScreenProps> = ({
  onOpenVideo,
  onOpenArticle,
  onOpenGuide,
  bookmarks,
  onToggleBookmark,
}) => {
  const { get, media } = useContent();
  const page = get<any>('agriculture.page');
  const videos = media('agriculture');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredVideos = videos.filter((v: any) => {
    if (activeFilter === 'all') return true;
    return v.category === activeFilter;
  });

  return (
    <div className="flex flex-col w-full pb-10 gap-6 md:gap-10">
      {/* En-tête Pôle Agricole */}
      <section className="pt-2 md:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#ffca98] text-[#7a532a]">
              <span className="material-symbols-outlined text-[16px]">eco</span>
              <span className="font-label-sm text-xs tracking-wider uppercase font-bold">
                {page.header.badge}
              </span>
            </div>

            <h2 className="font-headline-lg-mobile md:text-3xl lg:text-4xl text-[#012d1d] font-bold tracking-tight">
              {page.header.title}
            </h2>

            <p className="font-body-md text-sm md:text-base text-[#414844] leading-relaxed max-w-2xl">
              {page.header.description}
            </p>
          </div>

          {/* Mini statistiques d'impact - 3 cols on all sizes */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-2.5 sm:gap-4">
            {page.stats.map((st: any, i: number) => (
              <div
                key={i}
                className="flex flex-col p-3 sm:p-4 rounded-2xl bg-[#edf6ef] border border-[#c1c8c2]/50 shadow-xs hover:scale-102 transition-transform"
              >
                <span className="font-headline-sm text-lg sm:text-xl md:text-2xl text-[#012d1d] font-bold leading-none">
                  {st.value}
                </span>
                <span className="font-label-sm text-xs text-[#7d562d] mt-1.5 font-bold">
                  {st.label}
                </span>
                <span className="font-body-sm text-[11px] text-[#414844] leading-tight mt-0.5">
                  {st.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Barre de filtres fluides */}
      <section className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {page.filters.map((flt: any) => {
          const isActive = activeFilter === flt.id;
          return (
            <button
              key={flt.id}
              onClick={() => setActiveFilter(flt.id)}
              className={`filter-chip px-4 py-2 rounded-full font-label-md text-xs md:text-sm flex items-center gap-1.5 shrink-0 transition-all ${
                isActive
                  ? 'bg-[#012d1d] text-white shadow-xs font-bold'
                  : 'bg-[#e7f0ea] text-[#414844] hover:text-[#012d1d] hover:bg-[#dce5de]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{flt.icon}</span>
              <span>{flt.label}</span>
            </button>
          );
        })}
      </section>

      {/* Flux des Réalisations & Vidéos - Responsive 3-col Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video: any) => {
          const isSaved = bookmarks.includes(video.id);

          return (
            <article
              key={video.id}
              className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-[#c1c8c2]/40 group flex-1"
            >
              {/* Video Thumbnail */}
              <div
                className="relative w-full aspect-video group cursor-pointer overflow-hidden"
                onClick={() =>
                  onOpenVideo({
                    id: video.id,
                    title: video.title,
                    category: video.category,
                    tagLabel: video.tag,
                    tagIcon: video.tagIcon,
                    duration: video.duration,
                    views: '11.4k vues',
                    date: video.date,
                    image: video.image,
                    alt: video.alt,
                    summary: video.description,
                    actionText: video.btnText,
                    sector: 'agriculture',
                    stats: video.statMetric,
                    statsIcon: video.statIcon,
                  })
                }
              >
                <img
                  src={video.image}
                  alt={video.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/85 via-transparent to-black/25" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1b4332]/90 backdrop-blur-md text-white font-label-sm text-xs flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">
                    {video.tagIcon}
                  </span>
                  <span>{video.tag}</span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white font-label-sm text-xs">
                  {video.duration}
                </div>

                <button
                  aria-label={`Lire la vidéo ${video.title}`}
                  className="absolute inset-0 m-auto w-13 h-13 rounded-full bg-[#ffca98] text-[#7a532a] shadow-xl flex items-center justify-center transition-transform group-hover:scale-110 active:scale-90"
                >
                  <span
                    className="material-symbols-outlined text-[30px] ml-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                </button>

                {/* Progress preview */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[#dce5de]">
                  <div className={`h-full bg-[#7d562d] ${video.progress}`} />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col gap-2 flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#7d562d] font-label-sm text-xs font-semibold">
                    <span className="material-symbols-outlined text-[15px]">event_note</span>
                    <span>{video.date}</span>
                    <span>•</span>
                    <span>{video.badge}</span>
                  </div>

                  <h3 className="font-headline-md text-base md:text-lg text-[#012d1d] font-bold leading-snug mt-1 group-hover:text-[#7d562d] transition-colors line-clamp-2">
                    {video.title}
                  </h3>

                  <p className="font-body-md text-xs md:text-sm text-[#414844] leading-relaxed mt-2 line-clamp-3">
                    {video.description}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-[#dce5de]/70 mt-2">
                  <span className="font-label-md text-xs font-bold text-[#012d1d] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#7d562d] text-[17px]">
                      {video.statIcon}
                    </span>
                    {video.statMetric}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleBookmark(video.id, video.title)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isSaved
                          ? 'bg-[#012d1d] text-white'
                          : 'bg-[#e7f0ea] text-[#414844] hover:text-[#012d1d]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        bookmark
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        onOpenArticle({
                          id: video.id,
                          title: video.title,
                          date: video.date,
                          readTime: video.duration,
                          image: video.image,
                          alt: video.alt,
                          excerpt: video.description,
                          fullText: `${video.description}\n\nÀ Nagréogo, ce dispositif pilote est documenté chaque trimestre pour former les associations paysannes de la province. Les rendements observés dépassent les standards sahéliens grâce à l'enrichissement microbien et à la gestion raisonnée de l'eau.`,
                          category: 'Pôle Agricole',
                        })
                      }
                      className="px-3 py-1.5 rounded-full bg-[#e7f0ea] hover:bg-[#dce5de] text-[#012d1d] font-label-md text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>{video.btnText}</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* 2-Columns Bottom Section: Fiche Technique & Citation on Desktop */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Fiche Technique Téléchargeable */}
        <div className="p-5 md:p-6 rounded-2xl bg-[#e2eae4] shadow-xs flex flex-col justify-between gap-4 relative overflow-hidden border border-[#c1c8c2]">
          <div className="absolute -right-6 -bottom-6 opacity-10 text-[#012d1d] pointer-events-none">
            <span className="material-symbols-outlined text-[140px]">menu_book</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#012d1d] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[28px]">download_for_offline</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-xs uppercase tracking-wider text-[#7d562d] font-bold">
                {page.guideCard.badge}
              </span>
              <h4 className="font-headline-sm text-base md:text-lg text-[#012d1d] font-bold leading-tight mt-0.5">
                {page.guideCard.title}
              </h4>
              <p className="font-body-sm text-xs md:text-sm text-[#414844] mt-1 leading-relaxed">
                {page.guideCard.description}
              </p>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between gap-3 border-t border-[#c1c8c2]/50 relative z-10">
            <div className="flex items-center gap-1.5 text-[#414844] font-label-sm text-xs">
              <span className="material-symbols-outlined text-[17px] text-red-600">
                picture_as_pdf
              </span>
              <span>{page.guideCard.fileLabel}</span>
            </div>

            <button
              onClick={onOpenGuide}
              className="px-5 py-2.5 rounded-full bg-[#012d1d] text-white font-label-md text-xs font-semibold flex items-center gap-2 shadow hover:bg-[#1b4332] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>{page.guideCard.buttonLabel}</span>
            </button>
          </div>
        </div>

        {/* Citation du Cheick Bikienga */}
        <div className="p-5 md:p-6 rounded-2xl bg-[#edf6ef] shadow-xs flex flex-col justify-center relative overflow-hidden border-l-4 border-[#7d562d] border border-[#c1c8c2]/40">
          <span className="material-symbols-outlined text-[#7d562d] text-[32px] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
            format_quote
          </span>
          <p className="font-headline-md italic text-base md:text-lg text-[#012d1d] leading-relaxed">
            {page.quote}
          </p>
          <span className="font-label-sm text-xs uppercase tracking-wider text-[#7d562d] mt-3 font-bold">
            {page.author}
          </span>
          <span className="text-[11px] text-[#414844] mt-0.5">
            Transmission communautaire et écologie intégrale
          </span>
        </div>
      </section>
    </div>
  );
};


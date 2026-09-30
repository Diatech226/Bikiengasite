import React, { useState } from 'react';
import { HOME_ARTICLES, HOME_CONTENT, HOME_METRICS } from '../data/content';
import { useContent } from '../features/content/ContentContext';
import { ArticleItem, VideoItem } from '../types';

interface HomeScreenProps {
  articles: ArticleItem[];
  onOpenVideo: (video: VideoItem) => void;
  onOpenArticle: (article: ArticleItem) => void;
  onOpenDonation: () => void;
  onOpenAdmin: () => void;
  bookmarks: string[];
  onToggleBookmark: (id: string, title: string) => void;
  onShare: (title: string, desc: string) => void;
  articlesLoading: boolean;
  articlesError: string | null;
  onRetryArticles: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  articles,
  onOpenVideo,
  onOpenArticle,
  onOpenDonation,
  onOpenAdmin,
  bookmarks,
  onToggleBookmark,
  onShare,
  articlesLoading,
  articlesError,
  onRetryArticles,
}) => {
  const { get, media } = useContent();
  const page = get<typeof HOME_CONTENT & { metrics: typeof HOME_METRICS }>('home.page');
  const videos = media('home');
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'agriculture' | 'elevage' | 'humanitaire'>('all');

  const filterChips: { id: typeof activeFilter; label: string; icon: string }[] = [
    { id: 'all', label: 'Tous', icon: 'all_inclusive' },
    { id: 'video', label: 'Vidéos récentes', icon: 'smart_display' },
    { id: 'agriculture', label: 'Agriculture', icon: 'eco' },
    { id: 'elevage', label: 'Élevage', icon: 'pets' },
    { id: 'humanitaire', label: 'Humanitaire', icon: 'volunteer_activism' },
  ];

  const filteredVideos = videos.filter((v) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'video') return true;
    return v.category.includes(activeFilter);
  });

  return (
    <div className="flex flex-col w-full pb-10 gap-6 md:gap-10">
      {/* En-tête éditorial chaleureux & Citation - Responsive 2 columns on Desktop */}
      <section className="pt-2 md:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 flex flex-col">
            <span className="font-label-sm text-xs uppercase tracking-wider text-[#7d562d] font-bold">
              {page.badge}
            </span>
            <h2 className="font-headline-lg-mobile md:text-3xl lg:text-4xl text-[#012d1d] font-bold mt-1 tracking-tight">
              {page.title}
            </h2>
            <p className="font-body-md text-sm md:text-base text-[#414844] mt-2 leading-relaxed max-w-2xl">
              {page.description}
            </p>

            <div className="hidden sm:flex items-center gap-3 mt-4">
              <button
                onClick={onOpenDonation}
                className="px-5 py-2.5 rounded-full bg-[#012d1d] text-white font-label-md text-xs font-semibold hover:bg-[#1b4332] transition-colors shadow-xs"
              >
                {page.primaryButton}
              </button>
              <button
                onClick={() => onOpenArticle(HOME_ARTICLES[0])}
                className="px-5 py-2.5 rounded-full bg-[#e2eae4] text-[#012d1d] font-label-md text-xs font-semibold hover:bg-[#dce5de] transition-colors"
              >
                {page.secondaryButton}
              </button>
            </div>
          </div>

          {/* Encart de Sagesse du Cheick */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#e2eae4] rounded-2xl p-5 md:p-6 shadow-xs overflow-hidden border border-[#c1c8c2]/50 hover:shadow-md transition-shadow">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#ffca98]" />
              <div className="flex items-start gap-3 pl-2">
                <span
                  className="material-symbols-outlined text-[#7d562d] text-[28px] md:text-[32px] flex-shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  format_quote
                </span>
                <div className="flex flex-col">
                  <p className="font-headline-md text-base md:text-lg italic text-[#012d1d] leading-snug">
                    {page.quote}
                  </p>
                  <span className="font-label-sm text-xs text-[#7d562d] font-bold mt-2">
                    {page.quoteAuthor}
                  </span>
                  <span className="text-[11px] text-[#414844] mt-0.5">
                    {page.quoteCaption}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Métriques Clés d'Impact (Responsive Grid on sm/md/lg, Scroll on xs) */}
      <section className="py-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7d562d] text-[20px]">
              analytics
            </span>
            <h3 className="font-label-lg text-sm md:text-base text-[#012d1d] uppercase tracking-wide font-bold">
              {page.impactTitle}
            </h3>
          </div>
          <span className="font-label-sm text-xs text-[#7d562d] font-bold px-2.5 py-0.5 bg-[#ffdcbd]/50 rounded-full">
            {page.impactPeriod}
          </span>
        </div>

        {/* Mobile scroll, sm/md/lg 4-col grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {page.metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`${metric.bgColor} rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs border border-black/5 hover:scale-102 transition-transform`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                <span className={`material-symbols-outlined text-[22px] ${metric.textColor}`}>
                  {metric.icon}
                </span>
              </div>
              <div>
                <span className="font-headline-md text-xl md:text-2xl font-bold block leading-none tracking-tight">
                  {metric.value}
                </span>
                <span className={`font-label-sm text-xs font-semibold ${metric.textColor} block mt-1.5`}>
                  {metric.label}
                </span>
                {metric.sublabel && (
                  <span className="text-[11px] opacity-75 block mt-0.5">
                    {metric.sublabel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filtres de flux interactifs */}
      <section className="pt-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
            {filterChips.map((chip) => {
              const isActive = activeFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setActiveFilter(chip.id)}
                  className={`px-4 py-2 rounded-full font-label-md text-xs md:text-sm transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#012d1d] text-white shadow-sm font-bold'
                      : 'bg-[#e2eae4] text-[#414844] hover:text-[#012d1d] hover:bg-[#dce5de]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          <span className="hidden md:inline text-xs text-[#717973] font-medium">
            {filteredVideos.length} reportage{filteredVideos.length > 1 ? 's' : ''} disponible{filteredVideos.length > 1 ? 's' : ''}
          </span>
        </div>
      </section>

      {/* Fil d'actualité Multimédia & Blog - Responsive Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isSaved = bookmarks.includes(video.id);

            return (
              <article
                key={video.id}
                className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#c1c8c2]/40 group flex-1"
              >
                {/* Media Player Thumbnail */}
                <div
                  className="relative w-full aspect-video bg-[#dce5de] cursor-pointer overflow-hidden"
                  onClick={() => onOpenVideo(video)}
                >
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={video.image}
                    alt={video.alt}
                    referrerPolicy="no-referrer"
                  />
                  {/* Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/85 via-transparent to-black/25" />

                  {/* Tag & Badge Durée */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-[#1b4332]/90 backdrop-blur-md text-white font-label-sm text-xs tracking-wide flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[13px] text-[#b1f0ce]">
                        {video.tagIcon}
                      </span>
                      {video.tagLabel}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-label-sm text-xs tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">timer</span>
                      {video.duration}
                    </span>
                  </div>

                  {/* Bouton Play Emblématique Doré */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#ffca98]/95 text-[#7a532a] shadow-xl flex items-center justify-center transform group-hover:scale-110 active:scale-95 transition-all">
                      <span
                        className="material-symbols-outlined text-[32px] ml-1"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        play_arrow
                      </span>
                    </div>
                  </div>

                  {/* Indicateur de visionnage */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white font-label-sm text-xs">
                    <span className="flex items-center gap-1 opacity-90">
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      {video.views}
                    </span>
                    <span className="opacity-90">{video.badgeSubtitle}</span>
                  </div>
                </div>

                {/* Contenu immersif du post */}
                <div className="p-5 flex flex-col gap-2 flex-1 justify-between">
                  <div>
                    <h3 className="font-headline-sm text-base md:text-lg text-[#012d1d] leading-snug line-clamp-2 group-hover:text-[#7d562d] transition-colors">
                      {video.title}
                    </h3>
                    <p className="font-body-md text-xs md:text-sm text-[#414844] line-clamp-3 mt-2 leading-relaxed">
                      {video.summary}
                    </p>
                  </div>

                  {/* Actions de la carte */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#dce5de]">
                    <button
                      onClick={() => {
                        onOpenArticle({
                          id: video.id,
                          title: video.title,
                          date: video.date,
                          readTime: video.duration,
                          image: video.image,
                          alt: video.alt,
                          excerpt: video.summary,
                          fullText: video.fullText || video.summary,
                          category: video.tagLabel,
                        });
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#e7f0ea] text-[#012d1d] font-label-md text-xs font-semibold hover:bg-[#dce5de] flex items-center gap-1 transition-colors"
                    >
                      <span>{video.actionText}</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onShare(video.title, video.summary)}
                        aria-label="Partager"
                        className="w-8 h-8 rounded-full bg-[#e2eae4] text-[#414844] hover:text-[#012d1d] flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">share</span>
                      </button>
                      <button
                        onClick={() => onToggleBookmark(video.id, video.title)}
                        aria-label="Sauvegarder"
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isSaved
                            ? 'bg-[#012d1d] text-white'
                            : 'bg-[#e2eae4] text-[#414844] hover:text-[#012d1d]'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          bookmark
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Section 'Derniers écrits & Paroles de sagesse' - 3 Columns on Tablet/Desktop */}
      <section className="pt-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-label-sm text-xs uppercase tracking-wider text-[#7d562d] font-bold">
              Méditations & Enseignements
            </span>
            <h3 className="font-headline-sm text-lg md:text-xl text-[#012d1d] font-bold">
              Derniers écrits & Paroles de sagesse
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="text-xs px-3 py-1.5 rounded-full bg-[#f3fbf5] hover:bg-[#e2eae4] text-[#012d1d] border border-[#c1c8c2] font-semibold flex items-center gap-1.5 transition-colors"
              title="Accéder à l'espace de gestion et rédaction du blog"
            >
              <span className="material-symbols-outlined text-[16px] text-[#7d562d]">edit_note</span>
              <span>Gérer le blog</span>
            </button>

            {articles.filter((a) => (a.status || 'published') === 'published').length > 0 && (
              <button
                onClick={() => {
                  const first = articles.find((a) => (a.status || 'published') === 'published');
                  if (first) onOpenArticle(first);
                }}
                className="text-[#7d562d] font-label-md text-xs md:text-sm font-bold flex items-center hover:underline"
              >
                <span>Tout voir</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            )}
          </div>
        </div>

        {/* Responsive Grid for Articles: 1 col on mobile, 3 col on md/lg */}
        {articlesLoading ? (
          <div className="bg-white p-8 rounded-2xl border border-[#c1c8c2] text-center" role="status">Chargement des publications…</div>
        ) : articlesError ? (
          <div className="bg-white p-8 rounded-2xl border border-[#c1c8c2] text-center flex flex-col items-center gap-3" role="alert"><p>Les publications sont momentanément indisponibles.</p><button className="px-4 py-2 rounded-full bg-[#012d1d] text-white text-xs font-bold" onClick={onRetryArticles}>Réessayer</button></div>
        ) : (() => {
          const published = articles.filter((a) => (a.status || 'published') === 'published');
          if (published.length === 0) {
            return (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-[#c1c8c2] text-center flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-3xl text-[#717973]">feed</span>
                <p className="text-sm font-bold text-[#012d1d]">Aucun article publié pour l'instant</p>
                <p className="text-xs text-[#414844]">Accédez à la section administration pour créer ou activer des articles.</p>
                <button
                  onClick={onOpenAdmin}
                  className="mt-2 px-4 py-2 rounded-full bg-[#012d1d] text-white text-xs font-bold hover:bg-[#1b4332]"
                >
                  Rédiger un article
                </button>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {published.slice(0, 6).map((art) => (
                <div
                  key={art.id}
                  onClick={() => onOpenArticle(art)}
                  className="bg-white p-4 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group border border-[#c1c8c2]/40"
                >
                  <div>
                    <div className="w-full aspect-video rounded-xl overflow-hidden mb-3 bg-[#e2eae4] relative">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={art.image}
                        alt={art.alt}
                        referrerPolicy="no-referrer"
                      />
                      {art.isFeatured && (
                        <span className="absolute top-2 left-2 bg-[#7d562d] text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <span className="material-symbols-outlined text-[12px]">star</span>
                          À la une
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-label-sm text-xs text-[#7d562d] font-medium">
                      <span>{art.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {art.readTime}
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-sm md:text-base text-[#012d1d] group-hover:text-[#7d562d] transition-colors line-clamp-2 mt-1.5 font-bold">
                      {art.title}
                    </h4>
                    <p className="font-body-sm text-xs text-[#414844] line-clamp-2 mt-1 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#dce5de] flex items-center justify-between text-xs font-semibold text-[#012d1d]">
                    <span className="text-[#7d562d] truncate max-w-[140px]">{art.category}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform flex-shrink-0">
                      Lire l'enseignement
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </section>

      {/* Bannière d'Engagement Solidaire Flottante - Expansive on Desktop */}
      <section className="pt-2">
        <div className="bg-[#012d1d] rounded-2xl p-6 md:p-8 lg:p-10 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          {/* Halo d'ambiance */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#ffca98]/20 blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-2 max-w-2xl relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffca98] animate-pulse" />
              <span className="font-label-sm text-xs uppercase tracking-wider text-[#ffdcbd] font-bold">
                Partenariat & Fraternité Sahélienne
              </span>
            </div>
            <h3 className="font-headline-md text-xl md:text-2xl lg:text-3xl leading-tight text-white font-bold">
              Participez aux prochains chantiers de Nagréogo
            </h3>
            <p className="font-body-sm text-xs md:text-sm text-[#c1ecd4] leading-relaxed">
              Forages solaires, équipement agropastoral, banques céréalières et bourses aux orphelins. Chaque geste enracine l'espoir et l'autonomie sur notre terre ancestrale.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 flex-shrink-0">
            <button
              onClick={onOpenDonation}
              className="px-6 py-3 rounded-full bg-[#ffca98] text-[#7a532a] font-label-md text-sm font-bold shadow-sm hover:bg-[#f0bd8b] transition-all text-center active:scale-95"
            >
              Soutenir une action
            </button>
            <button
              onClick={onOpenDonation}
              className="px-6 py-3 rounded-full bg-white/10 text-white font-label-md text-sm font-semibold hover:bg-white/20 transition-colors text-center border border-white/20"
            >
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

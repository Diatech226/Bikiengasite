import React, { useState } from 'react';
import { useContent } from '../features/content/ContentContext';
import { ArticleItem, VideoItem } from '../types';

interface ElevageScreenProps {
  onOpenVideo: (video: VideoItem) => void;
  onOpenArticle: (article: ArticleItem) => void;
  onOpenDonation: () => void;
  bookmarks: string[];
  onToggleBookmark: (id: string, title: string) => void;
}

export const ElevageScreen: React.FC<ElevageScreenProps> = ({
  onOpenVideo,
  onOpenArticle,
  onOpenDonation,
  bookmarks,
  onToggleBookmark,
}) => {
  const { get, media } = useContent();
  const page = get<any>('elevage.page');
  const videos = media('elevage');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="flex flex-col w-full pb-12">
      {/* En-tête Thématique Pastoral */}
      <section className="px-margin pt-space-md pb-space-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-col gap-space-sm max-w-2xl">
          <div className="flex items-center gap-space-xs text-[#7d562d]">
            <span className="material-symbols-outlined text-[18px]">cruelty_free</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest font-bold">
              {page.header.badge}
            </span>
          </div>

          <h2 className="font-headline-lg-mobile md:text-3xl lg:text-4xl text-[#012d1d] tracking-tight font-bold">
            {page.header.title}
          </h2>

          <p className="font-body-md text-body-md text-[#414844] leading-relaxed">
            {page.header.description}
          </p>
        </div>

        {/* Citation du Cheick */}
        <div className="p-space-md lg:p-6 bg-[#e7f0ea] rounded-xl flex items-start gap-space-sm shadow-xs relative overflow-hidden border border-[#c1c8c2]/40 max-w-xl">
          <div className="w-1.5 self-stretch bg-[#7d562d] rounded-full flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="material-symbols-outlined text-[#7d562d] text-[22px]">
              format_quote
            </span>
            <p className="font-headline-md text-[1rem] leading-snug italic text-[#012d1d]">
              {page.header.quote}
            </p>
            <span className="font-label-sm text-label-sm text-[#7d562d] uppercase font-semibold tracking-wider mt-1">
              {page.header.author}
            </span>
          </div>
        </div>
      </section>

      {/* Filtres Rapides Pastoraux */}
      <div className="w-full px-margin pb-space-md flex items-center gap-space-xs overflow-x-auto no-scrollbar md:flex-wrap">
        {page.filters.map((flt: any) => {
          const isActive = activeFilter === flt.id;
          return (
            <button
              key={flt.id}
              onClick={() => setActiveFilter(flt.id)}
              className={`px-space-md py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#012d1d] text-white shadow-xs font-bold'
                  : 'bg-[#e2eae4] text-[#151d1a] hover:bg-[#dce5de]'
              }`}
            >
              {flt.label}
            </button>
          );
        })}
      </div>

      {/* Métriques & Indicateurs Clés du Cheptel */}
      <section className="px-margin mb-space-lg flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm md:text-xl text-[#012d1d] font-bold">
            Tableau d'impact pastoral
          </h3>
          <span className="font-label-sm text-label-sm text-[#7d562d] font-bold uppercase tracking-wider">
            Saison 2024-2025
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
          {page.stats.map((st: any, i: number) => (
            <div
              key={i}
              className="p-space-md md:p-5 bg-white rounded-xl shadow-xs flex items-center sm:flex-col sm:items-start justify-between sm:justify-start gap-3 border border-[#c1c8c2]/40 transition-transform hover:-translate-y-0.5"
            >
              <div
                className={`w-10 h-10 rounded-full ${st.bg} flex items-center justify-center`}
              >
                <span className="material-symbols-outlined text-[20px]">{st.icon}</span>
              </div>
              <div>
                <span className="font-headline-md md:text-3xl text-[#012d1d] font-bold block leading-none">
                  {st.value}
                </span>
                <span className="font-label-sm md:text-sm text-[#414844] leading-tight block mt-1.5 font-medium">
                  {st.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flux Vidéo & Blog d'Élevage */}
      <section className="px-margin flex flex-col gap-space-md mb-space-xl">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-[#7d562d] uppercase font-semibold">
              Reportages & Pratiques
            </span>
            <h3 className="font-headline-sm md:text-2xl text-[#012d1d] font-bold">
              Carnet d'Apprentissage & Vidéos
            </h3>
          </div>
          <span className="material-symbols-outlined text-[#7d562d] text-2xl">movie</span>
        </div>

        {/* Video Grid responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* POST VIDÉO 1 : Embouche bovine intensive */}
          {(() => {
            const v = videos[0];
            const isSaved = bookmarks.includes(v.id);
            return (
              <article className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col border border-[#c1c8c2]/40 hover:shadow-md transition-shadow">
                <div
                  className="relative w-full aspect-video group cursor-pointer"
                  onClick={() =>
                    onOpenVideo({
                      id: v.id,
                      title: v.title,
                      category: 'elevage',
                      tagLabel: v.badge,
                      tagIcon: v.badgeIcon,
                      duration: v.duration,
                      views: '9.2k vues',
                      date: v.date,
                      image: v.image,
                      alt: v.alt,
                      summary: v.description,
                      actionText: v.actionText,
                      sector: 'elevage',
                    })
                  }
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={v.image}
                    alt={v.alt}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/85 via-transparent to-black/25" />

                  <div className="absolute top-space-sm left-space-sm flex items-center gap-1.5 bg-[#012d1d]/90 text-white px-2.5 py-1 rounded-full text-label-sm font-label-sm backdrop-blur-md">
                    <span className="material-symbols-outlined text-[14px]">{v.badgeIcon}</span>
                    <span>{v.badge}</span>
                  </div>

                  <div className="absolute top-space-sm right-space-sm bg-black/60 text-white font-label-sm text-label-sm px-2 py-0.5 rounded backdrop-blur-sm">
                    {v.duration}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#ffdcbd] text-[#2c1600] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 active:scale-95">
                      <span className="material-symbols-outlined text-[32px] translate-x-0.5">
                        play_arrow
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-space-sm left-space-sm right-space-sm">
                    <h4 className="font-headline-sm text-white drop-shadow-sm leading-tight line-clamp-1">
                      {v.title}
                    </h4>
                  </div>
                </div>

                <div className="p-space-md flex-1 flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-space-sm">
                    <p className="font-body-sm text-body-sm text-[#414844] leading-relaxed">
                      {v.description}
                    </p>

                    {/* Mini-tableau de ration nutritive */}
                    <div className="p-space-sm bg-[#e7f0ea] rounded-lg flex flex-col gap-1.5 border border-[#c1ecd4]">
                      <div className="flex justify-between items-center text-[#012d1d] font-label-md text-label-md">
                        <span>{page.rationLabel}</span>
                        <span className="text-[#7d562d] font-bold">{page.rationValue}</span>
                      </div>
                      <div className="w-full bg-[#dce5de] rounded-full h-2 overflow-hidden flex">
                        <div className="bg-[#012d1d] h-full" style={{ width: '45%' }} title={page.rationTooltips[0]} />
                        <div className="bg-[#7d562d] h-full" style={{ width: '35%' }} title={page.rationTooltips[1]} />
                        <div className="bg-[#ffca98] h-full" style={{ width: '20%' }} title={page.rationTooltips[2]} />
                      </div>
                      <div className="flex justify-between text-[#414844] font-label-sm text-[0.625rem]">
                        <span>{page.rationParts[0]}</span>
                        <span>{page.rationParts[1]}</span>
                        <span>{page.rationParts[2]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs text-[#414844] border-t border-[#dce5de]">
                    <span className="font-label-sm text-label-sm">{v.date}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleBookmark(v.id, v.title)}
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
                            id: v.id,
                            title: v.title,
                            date: v.date,
                            readTime: v.duration,
                            image: v.image,
                            alt: v.alt,
                            excerpt: v.description,
                            fullText: `${v.description}\n\nPour maximiser la prise de poids des zébus sahéliens en période sèche sans faire appel à des tourteaux d'importation coûteux, la ferme de Nagréogo a mis au point un protocole basé sur l'ensilage de niébé récolté à l'automne, mélangé aux fanes d'arachide et aux résidus de maïs broyés. Le bétail reçoit également une pierre à lécher riche en sel de roche local et en minéraux essentiels.`,
                            category: 'Pôle Pastoral & Élevage',
                          })
                        }
                        className="flex items-center gap-1 text-[#012d1d] font-label-md text-label-md hover:text-[#7d562d] font-semibold"
                      >
                        <span>{v.actionText}</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })()}

          {/* POST VIDÉO 2 : Campagne vaccinale solidaire */}
          {(() => {
            const v = videos[1];
            const isSaved = bookmarks.includes(v.id);
            return (
              <article className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col border border-[#c1c8c2]/40 hover:shadow-md transition-shadow">
                <div
                  className="relative w-full aspect-video group cursor-pointer"
                  onClick={() =>
                    onOpenVideo({
                      id: v.id,
                      title: v.title,
                      category: 'elevage',
                      tagLabel: v.badge,
                      tagIcon: v.badgeIcon,
                      duration: v.duration,
                      views: '7.8k vues',
                      date: v.date,
                      image: v.image,
                      alt: v.alt,
                      summary: v.description,
                      actionText: v.actionText,
                      sector: 'elevage',
                    })
                  }
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={v.image}
                    alt={v.alt}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/85 via-transparent to-black/25" />

                  <div className="absolute top-space-sm left-space-sm flex items-center gap-1.5 bg-[#ffca98] text-[#7a532a] px-2.5 py-1 rounded-full text-label-sm font-label-sm backdrop-blur-md font-bold">
                    <span className="material-symbols-outlined text-[14px]">{v.badgeIcon}</span>
                    <span>{v.badge}</span>
                  </div>

                  <div className="absolute top-space-sm right-space-sm bg-black/60 text-white font-label-sm text-label-sm px-2 py-0.5 rounded backdrop-blur-sm">
                    {v.duration}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#ffdcbd] text-[#2c1600] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 active:scale-95">
                      <span className="material-symbols-outlined text-[32px] translate-x-0.5">
                        play_arrow
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-space-sm left-space-sm right-space-sm">
                    <h4 className="font-headline-sm text-white drop-shadow-sm leading-tight line-clamp-1">
                      {v.title}
                    </h4>
                  </div>
                </div>

                <div className="p-space-md flex-1 flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-space-sm">
                    <p className="font-body-sm text-body-sm text-[#414844] leading-relaxed">
                      {v.description}
                    </p>

                    {/* Statistique d'impact immédiat */}
                    {v.statHighlight && (
                      <div className="flex items-center gap-space-sm p-space-sm bg-[#c1ecd4]/40 rounded-lg border border-[#c1ecd4]">
                        <div className="w-8 h-8 rounded-full bg-[#012d1d] flex items-center justify-center text-white flex-shrink-0">
                          <span className="material-symbols-outlined text-[18px]">trending_down</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-[#012d1d] font-bold">
                            {v.statHighlight.title}
                          </span>
                          <span className="font-label-sm text-label-sm text-[#414844]">
                            {v.statHighlight.subtitle}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-space-xs text-[#414844] border-t border-[#dce5de]">
                    <span className="font-label-sm text-label-sm">{v.date}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleBookmark(v.id, v.title)}
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
                            id: v.id,
                            title: v.title,
                            date: v.date,
                            readTime: v.duration,
                            image: v.image,
                            alt: v.alt,
                            excerpt: v.description,
                            fullText: `${v.description}\n\nChaque année au mois de janvier, une brigade vétérinaire mobile sillonne les campements pastoraux et les fermes de Nagréogo pour administrer gratuitement vaccins, vitamines injectables et antiparasitaires internes. Cette prévoyance évite les épizooties dévastatrices et préserve le seul capital d'épargne liquide de la population rurale.`,
                            category: 'Santé Vétérinaire',
                          })
                        }
                        className="flex items-center gap-1 text-[#012d1d] font-label-md text-label-md hover:text-[#7d562d] font-semibold"
                      >
                        <span>{v.actionText}</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })()}

          {/* POST VIDÉO 3 : La mini-laiterie villageoise */}
          {(() => {
            const v = videos[2];
            const isSaved = bookmarks.includes(v.id);
            return (
              <article className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col border border-[#c1c8c2]/40 hover:shadow-md transition-shadow">
                <div
                  className="relative w-full aspect-video group cursor-pointer"
                  onClick={() =>
                    onOpenVideo({
                      id: v.id,
                      title: v.title,
                      category: 'elevage',
                      tagLabel: v.badge,
                      tagIcon: v.badgeIcon,
                      duration: v.duration,
                      views: '10.5k vues',
                      date: v.date,
                      image: v.image,
                      alt: v.alt,
                      summary: v.description,
                      actionText: v.actionText,
                      sector: 'elevage',
                    })
                  }
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={v.image}
                    alt={v.alt}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/85 via-transparent to-black/25" />

                  <div className="absolute top-space-sm left-space-sm flex items-center gap-1.5 bg-[#1b4332] text-white px-2.5 py-1 rounded-full text-label-sm font-label-sm backdrop-blur-md">
                    <span className="material-symbols-outlined text-[14px]">{v.badgeIcon}</span>
                    <span>{v.badge}</span>
                  </div>

                  <div className="absolute top-space-sm right-space-sm bg-black/60 text-white font-label-sm text-label-sm px-2 py-0.5 rounded backdrop-blur-sm">
                    {v.duration}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#ffdcbd] text-[#2c1600] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 active:scale-95">
                      <span className="material-symbols-outlined text-[32px] translate-x-0.5">
                        play_arrow
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-space-sm left-space-sm right-space-sm">
                    <h4 className="font-headline-sm text-white drop-shadow-sm leading-tight line-clamp-1">
                      {v.title}
                    </h4>
                  </div>
                </div>

                <div className="p-space-md flex-1 flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-space-sm">
                    <p className="font-body-sm text-body-sm text-[#414844] leading-relaxed">
                      {v.description}
                    </p>

                    {/* Étapes clés */}
                    {v.steps && (
                      <div className="space-y-1.5 pt-1">
                        {v.steps.map((st: any) => (
                          <div key={st.num} className="flex items-start gap-2 text-body-sm text-[#151d1a]">
                            <span className="w-5 h-5 rounded-full bg-[#e2eae4] text-[#012d1d] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {st.num}
                            </span>
                            <span className="text-xs">
                              <strong className="font-semibold text-[#012d1d]">{st.title}</strong>{' '}
                              {st.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-space-xs text-[#414844] border-t border-[#dce5de]">
                    <span className="font-label-sm text-label-sm">{v.date}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleBookmark(v.id, v.title)}
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
                            id: v.id,
                            title: v.title,
                            date: v.date,
                            readTime: v.duration,
                            image: v.image,
                            alt: v.alt,
                            excerpt: v.description,
                            fullText: `${v.description}\n\nLa mini-laiterie de Nagréogo collecte chaque matin auprès de 60 foyers d'éleveurs plus de 850 litres de lait frais. Grâce à une installation de refroidissement solaire et à des pasteurisateurs alimentés au biogaz, le lait conserve l'intégralité de ses vitamines et peut être conservé sainement en bouteilles de verre réutilisables.`,
                            category: 'Mini-Laiterie',
                          })
                        }
                        className="flex items-center gap-1 text-[#012d1d] font-label-md text-label-md hover:text-[#7d562d] font-semibold"
                      >
                        <span>{v.actionText}</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })()}
        </div>
      </section>

      {/* Rubrique 'Conseils de l'Éleveur' : Spécial Canicule Sahélienne */}
      <section className="px-margin mb-space-xl flex flex-col gap-space-md">
        <div className="flex items-center gap-space-xs">
          <div className="w-2 h-6 bg-[#7d562d] rounded-full" />
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-[#7d562d] uppercase font-bold tracking-wider">
              Guides Pastoraux Pratiques
            </span>
            <h3 className="font-headline-sm md:text-2xl text-[#012d1d] font-bold">
              3 Conseils vitaux pour la canicule sahélienne
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {page.rules.map((rule: any, idx: number) => (
            <div
              key={idx}
              className="p-space-md bg-white rounded-xl shadow-xs flex items-start gap-space-md border border-[#c1c8c2]/40 hover:border-[#7d562d]/50 transition-colors"
            >
              <div
                className={`w-11 h-11 rounded-xl ${rule.bgIcon} flex items-center justify-center flex-shrink-0`}
              >
                <span className="material-symbols-outlined text-[24px]">{rule.icon}</span>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline-sm text-[1rem] leading-snug text-[#012d1d] font-bold">
                    {rule.title}
                  </h4>
                  <span className="font-label-sm text-[0.6875rem] text-[#7d562d] font-bold">
                    {rule.ruleNum}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-[#414844] leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bandeau d'Appel à l'Action & Soutien Pastoral */}
      <section className="px-margin pb-space-lg">
        <div className="p-6 md:p-8 bg-[#012d1d] rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#ffca98]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 max-w-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#ffdcbd] text-[#2c1600] flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[32px]">volunteer_activism</span>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm md:text-2xl text-white font-bold">
                {page.ctaTitle}
              </h3>
              <p className="font-body-sm text-sm text-[#c1ecd4]">
                {page.ctaDescription}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <button
              onClick={onOpenDonation}
              className="py-3 px-6 rounded-xl bg-[#7d562d] text-white font-label-lg shadow-sm hover:bg-[#623f18] active:scale-95 transition-all flex items-center justify-center gap-2 font-bold whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              <span>{page.donationButton}</span>
            </button>

            <button
              onClick={onOpenDonation}
              className="py-3 px-6 rounded-xl bg-[#1b4332] text-white font-label-lg active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold hover:bg-opacity-90 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">contact_support</span>
              <span>{page.contactButton}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

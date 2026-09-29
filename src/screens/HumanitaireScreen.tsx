import React, { useState } from 'react';
import { HUMANITAIRE_DATA } from '../data/content';
import { ArticleItem, VideoItem } from '../types';

interface HumanitaireScreenProps {
  onOpenVideo: (video: VideoItem) => void;
  onOpenArticle: (article: ArticleItem) => void;
  onOpenDonation: () => void;
  bookmarks: string[];
  onToggleBookmark: (id: string, title: string) => void;
  onShare: (title: string, desc: string) => void;
}

export const HumanitaireScreen: React.FC<HumanitaireScreenProps> = ({
  onOpenVideo,
  onOpenArticle,
  onOpenDonation,
  bookmarks,
  onToggleBookmark,
  onShare,
}) => {
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactType, setContactType] = useState('forage');
  const [contactMessage, setContactMessage] = useState('');
  const [formFeedback, setFormFeedback] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Actions Humanitaires - Cheick Bikienga',
          text: 'Découvrez les forages, greniers et écoles de solidarité à Nagréogo.',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 3000);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) return;
    setFormFeedback(true);
    setTimeout(() => {
      setFormFeedback(false);
      setShowQuickForm(false);
      setContactName('');
      setContactPhone('');
      setContactMessage('');
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Header section */}
      <section className="px-margin pt-space-md pb-space-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-col gap-space-sm max-w-2xl">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#ffca98]/40 text-[#623f18]">
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              volunteer_activism
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
              {HUMANITAIRE_DATA.header.badge}
            </span>
          </div>

          <h2 className="font-headline-lg-mobile md:text-3xl lg:text-4xl text-[#012d1d] tracking-tight font-bold">
            {HUMANITAIRE_DATA.header.title}
          </h2>

          <p className="font-body-md text-body-md text-[#414844] leading-relaxed">
            {HUMANITAIRE_DATA.header.description}
          </p>
        </div>

        {/* Citation du Cheick */}
        <div className="relative p-space-md lg:p-6 rounded-xl bg-[#edf6ef] shadow-xs border border-[#c1c8c2]/40 max-w-xl">
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#7d562d] rounded-r-full" />
          <div className="pl-space-xs flex flex-col gap-1">
            <span className="material-symbols-outlined text-[#7d562d] text-[24px]">
              format_quote
            </span>
            <blockquote className="font-headline-md text-headline-md italic text-[#012d1d] leading-snug">
              {HUMANITAIRE_DATA.header.quote}
            </blockquote>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-5 h-[1.5px] bg-[#7d562d]" />
              <span className="font-label-md text-label-md text-[#7d562d] font-bold">
                {HUMANITAIRE_DATA.header.author}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mesure de l'Entraide (Bilan Actif) */}
      <section className="px-margin mb-space-lg">
        <div className="p-space-md md:p-6 rounded-2xl bg-[#e7f0ea] shadow-xs flex flex-col gap-space-md border border-[#c1c8c2]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[#012d1d] text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                diversity_1
              </span>
              <span className="font-headline-sm md:text-xl text-[#012d1d] font-bold">
                Mesure de l'Entraide
              </span>
            </div>
            <span className="font-label-sm text-label-sm px-3 py-1 rounded-full bg-[#c1ecd4] text-[#002114] font-bold">
              Bilan Actif
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
            {HUMANITAIRE_DATA.stats.map((st, i) => (
              <div
                key={i}
                className="flex items-center sm:flex-col sm:items-center justify-between sm:justify-center p-4 rounded-xl bg-white text-center shadow-xs border border-[#c1c8c2]/30 transition-transform hover:-translate-y-0.5"
              >
                <span className={`material-symbols-outlined mb-1 text-[26px] ${st.color}`}>
                  {st.icon}
                </span>
                <span className={`font-headline-sm md:text-3xl font-bold leading-tight ${st.color}`}>
                  {st.value}
                </span>
                <span className="font-label-sm md:text-sm text-[#414844] mt-0.5 font-medium">
                  {st.label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar Puits N°39 */}
          <div className="flex flex-col gap-1.5 pt-2">
            <div className="flex justify-between items-center text-[#414844]">
              <span className="font-label-md text-label-md font-bold text-[#012d1d]">
                {HUMANITAIRE_DATA.wellProgress.title}
              </span>
              <span className="font-label-sm text-label-sm text-[#012d1d] font-bold">
                {HUMANITAIRE_DATA.wellProgress.percent}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#ffdcbd]/70 overflow-hidden">
              <div
                className="h-full bg-[#012d1d] rounded-full transition-all duration-700"
                style={{ width: `${HUMANITAIRE_DATA.wellProgress.percent}%` }}
              />
            </div>
            <span className="font-label-sm text-label-sm text-[#414844] italic">
              {HUMANITAIRE_DATA.wellProgress.note}
            </span>
          </div>
        </div>
      </section>

      {/* Chroniques de Solidarité */}
      <section className="px-margin flex flex-col gap-space-md mb-space-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-md md:text-2xl text-[#012d1d] font-bold">
              Chroniques de Solidarité
            </h3>
            <p className="font-body-sm text-body-sm text-[#414844]">
              Vidéos immersives et récits de terrain
            </p>
          </div>
          <span className="material-symbols-outlined text-[#414844] text-2xl">video_library</span>
        </div>

        {/* Stories Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HUMANITAIRE_DATA.chronicles.map((story) => {
            const isExpanded = !!expandedArticles[story.id];
            const isSaved = bookmarks.includes(story.id);

            return (
              <article
                key={story.id}
                className="flex flex-col rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow border border-[#c1c8c2]/40"
              >
                {/* Thumbnail */}
                <div
                  className="relative w-full aspect-video bg-[#dce5de] overflow-hidden group cursor-pointer"
                  onClick={() =>
                    onOpenVideo({
                      id: story.id,
                      title: story.title,
                      category: 'humanitaire',
                      tagLabel: story.badge,
                      tagIcon: story.badgeIcon,
                      duration: story.duration,
                      views: '12.8k vues',
                      date: story.location,
                      image: story.image,
                      alt: story.alt,
                      summary: story.description,
                      fullText: `${story.description}\n\n${story.expandedNarrative}\n\n${story.impactBox}`,
                      actionText: 'Lire le récit',
                      sector: 'humanitaire',
                      stats: story.statusText,
                    })
                  }
                >
                  <img
                    src={story.image}
                    alt={story.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/85 via-transparent to-black/25" />

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#012d1d]/85 backdrop-blur-md text-white font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px]">
                      {story.badgeIcon}
                    </span>
                    <span>{story.badge}</span>
                  </div>

                  <button
                    aria-label={`Lire la vidéo ${story.title}`}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#ffca98]/95 text-[#7a532a] flex items-center justify-center shadow-lg transition-transform active:scale-95 group-hover:scale-110"
                  >
                    <span
                      className="material-symbols-outlined text-[28px] ml-0.5"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_arrow
                    </span>
                  </button>

                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white font-label-sm text-label-sm backdrop-blur-sm">
                    {story.duration}
                  </span>
                </div>

                {/* Story Body */}
                <div className="p-space-md flex-1 flex flex-col justify-between gap-space-xs">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[#7d562d] font-label-sm text-label-sm font-semibold">
                      <span>{story.location}</span>
                    </div>

                    <h4 className="font-headline-sm text-headline-sm text-[#012d1d] leading-tight font-bold">
                      {story.title}
                    </h4>

                    <p className="font-body-sm text-body-sm text-[#414844] line-clamp-3">
                      {story.description}
                    </p>
                  </div>

                  <div className="pt-space-xs flex flex-col gap-2">
                    {/* Impact badge & Read button */}
                    <div className="flex items-center justify-between pt-space-xs border-t border-[#dce5de]/50">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                          verified
                        </span>
                        <span className="font-label-sm text-label-sm text-[#151d1a] font-semibold truncate max-w-[120px] sm:max-w-none">
                          {story.statusText}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onToggleBookmark(story.id, story.title)}
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
                          onClick={() => toggleExpand(story.id)}
                          className="inline-flex items-center gap-1 font-label-md text-label-md text-[#7d562d] hover:text-[#012d1d] transition-colors font-bold px-2 py-1"
                        >
                          <span>{isExpanded ? 'Réduire' : 'Lire'}</span>
                          <span
                            className={`material-symbols-outlined text-[16px] transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          >
                            expand_more
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Collapsible narrative */}
                    {isExpanded && (
                      <div className="pt-space-sm bg-[#edf6ef] p-3 rounded-lg text-body-sm text-[#414844] flex flex-col gap-2 border border-[#c1ecd4] animate-in fade-in">
                        <p className="leading-relaxed">{story.expandedNarrative}</p>
                        <div className="p-2.5 rounded bg-[#c1ecd4]/50 text-[#002114] font-label-sm text-label-sm font-semibold">
                          {story.impactBox}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Section Agir aux côtés du Cheick - 2 Columns on desktop */}
      <section className="px-margin mb-space-xl">
        <div className="p-6 md:p-8 rounded-2xl bg-[#012d1d] text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Vision & Actions */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-space-sm">
                <div className="w-12 h-12 rounded-xl bg-[#ffca98] text-[#7a532a] flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[26px]">handshake</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-sm md:text-2xl text-white leading-tight font-bold">
                    Agir aux côtés du Cheick
                  </h3>
                  <span className="font-label-sm text-label-sm text-[#c1ecd4]">
                    Relayez, parrainez ou participez aux œuvres de Nagréogo
                  </span>
                </div>
              </div>

              <p className="font-body-sm text-sm text-[#dce5de] leading-relaxed">
                Votre concours, qu'il soit financier, matériel ou humain, va directement au bénéfice des habitants de Nagréogo et des localités environnantes, sans aucun intermédiaire superflu.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <button
                  onClick={onOpenDonation}
                  className="h-12 px-4 rounded-xl bg-[#ffca98] text-[#2c1600] font-label-lg flex items-center justify-center gap-2 shadow-md hover:bg-[#ffdcbd] transition-colors active:scale-[0.98] font-bold"
                >
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                  <span>Faire un don direct</span>
                </button>

                <button
                  onClick={handleShareClick}
                  className="h-12 px-4 rounded-xl bg-[#7d562d] text-white font-label-lg flex items-center justify-center gap-2 shadow-md hover:bg-[#623f18] transition-colors active:scale-[0.98] font-bold"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                  <span>{shareFeedback ? 'Lien copié !' : 'Partager la cause'}</span>
                </button>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-[#c1ecd4]">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Transparence absolue et suivi rigoureux sur le terrain à Nagréogo</span>
              </div>
            </div>

            {/* Right Column: Interactive Quick Form */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/15 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-base text-white font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffca98] text-[20px]">mail</span>
                  <span>Secrétariat & Engagement Solidaire</span>
                </span>
                <span className="text-xs text-[#c1ecd4]">Réponse rapide</span>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full h-11 px-3 rounded-lg bg-white text-[#151d1a] font-body-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#ffca98]"
                  />

                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Téléphone / WhatsApp"
                    className="w-full h-11 px-3 rounded-lg bg-white text-[#151d1a] font-body-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#ffca98]"
                  />
                </div>

                <select
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-white text-[#151d1a] font-body-sm text-sm focus:outline-none"
                >
                  <option value="forage">Contribution Forage & Eau Potable</option>
                  <option value="scolaire">Parrainage d'un orphelin / École</option>
                  <option value="vivres">Dons de vivres & céréales d'urgence</option>
                  <option value="benevole">Volontariat de compétences sur le terrain</option>
                </select>

                <textarea
                  rows={2}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Votre message ou proposition d'aide..."
                  className="w-full p-3 rounded-lg bg-white text-[#151d1a] font-body-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#ffca98]"
                />

                <button
                  type="submit"
                  className="h-11 rounded-lg bg-[#ffdcbd] text-[#2c1600] font-label-lg font-bold flex items-center justify-center gap-2 hover:bg-[#ffca98] transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Transmettre mon engagement</span>
                </button>

                {formFeedback && (
                  <span className="font-label-sm text-sm text-[#ffdcbd] text-center pt-1 font-bold animate-in fade-in">
                    Barakallahou fik ! Votre demande a été reçue avec gratitude.
                  </span>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


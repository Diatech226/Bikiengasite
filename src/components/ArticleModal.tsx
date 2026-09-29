import React, { useState } from 'react';
import { ArticleItem } from '../types';

interface ArticleModalProps {
  article: ArticleItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, title: string) => void;
  onShare: (title: string, desc: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onShare,
}) => {
  const [isNarrating, setIsNarrating] = useState(false);
  const [fontSizeLarge, setFontSizeLarge] = useState(false);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="w-full max-w-xl bg-[#f3fbf5] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-[#c1c8c2] animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#012d1d] text-white">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#ffca98] text-[20px]">
              menu_book
            </span>
            <span className="font-label-md text-xs font-semibold tracking-wide text-[#ffdcbd] truncate">
              {article.category || 'Paroles & Récits de Nagréogo'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFontSizeLarge(!fontSizeLarge)}
              aria-label="Ajuster la taille du texte"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
              title="Ajuster la taille du texte"
            >
              <span className="font-bold text-xs">A{fontSizeLarge ? '-' : '+'}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Fermer la lecture"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {/* Hero Image */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm bg-[#e2eae4]">
            <img
              src={article.image}
              alt={article.alt}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-label-sm">
              <span className="bg-[#012d1d]/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {article.date}
              </span>
              <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                {article.readTime}
              </span>
            </div>
          </div>

          {/* Title & Metadata */}
          <div>
            <h2 className="font-headline-lg-mobile text-[1.5rem] text-[#012d1d] font-bold leading-tight">
              {article.title}
            </h2>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#dce5de]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ffca98] text-[#7a532a] flex items-center justify-center font-bold text-xs">
                  CB
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-xs font-bold text-[#012d1d]">
                    Cheick Bikienga Seydou
                  </span>
                  <span className="text-[11px] text-[#7d562d]">Guide Spirituel & Bâtisseur</span>
                </div>
              </div>

              {/* Audio Narration button */}
              <button
                onClick={() => setIsNarrating(!isNarrating)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isNarrating
                    ? 'bg-[#1b4332] text-white shadow-sm'
                    : 'bg-[#e7f0ea] text-[#012d1d] hover:bg-[#dce5de]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: isNarrating ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {isNarrating ? 'volume_up' : 'headphones'}
                </span>
                <span>{isNarrating ? 'Écoute en cours...' : 'Écouter'}</span>
              </button>
            </div>
          </div>

          {/* Audio player simulator bar if narrating */}
          {isNarrating && (
            <div className="p-3 rounded-xl bg-[#e7f0ea] border border-[#c1ecd4] flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7d562d] animate-ping" />
                <span className="font-label-sm text-xs text-[#012d1d] font-semibold">
                  Lecture vocale (Français & Mooré)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-3 bg-[#7d562d] animate-bounce" />
                <div className="w-1 h-5 bg-[#012d1d] animate-bounce delay-75" />
                <div className="w-1 h-4 bg-[#7d562d] animate-bounce delay-150" />
                <div className="w-1 h-6 bg-[#012d1d] animate-bounce delay-200" />
              </div>
            </div>
          )}

          {/* Excerpt callout */}
          <div className="p-3.5 rounded-xl bg-[#edf6ef] border-l-4 border-[#7d562d]">
            <p className="font-headline-md italic text-sm text-[#012d1d] leading-relaxed">
              « {article.excerpt} »
            </p>
          </div>

          {/* Main Full Text */}
          <div
            className={`font-body-md text-[#414844] space-y-3 leading-relaxed ${
              fontSizeLarge ? 'text-[1.0625rem] leading-8' : 'text-[0.9375rem] leading-7'
            }`}
          >
            {article.fullText ? (
              article.fullText.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-1 text-[#151d1a]">
                      {items.map((it, i) => (
                        <li key={i}>{it.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.startsWith('«')) {
                  return (
                    <blockquote
                      key={index}
                      className="p-3 bg-[#ffca98]/20 rounded-xl border border-[#ffca98]/50 italic text-[#012d1d] font-serif font-semibold"
                    >
                      {paragraph}
                    </blockquote>
                  );
                }
                return <p key={index}>{paragraph}</p>;
              })
            ) : (
              <p>{article.excerpt}</p>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#dce5de]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(article.id, article.title)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isBookmarked
                    ? 'bg-[#012d1d] text-white'
                    : 'bg-[#e7f0ea] text-[#414844] hover:text-[#012d1d]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                >
                  bookmark
                </span>
                <span>{isBookmarked ? 'Enregistré' : 'Enregistrer'}</span>
              </button>

              <button
                onClick={() => onShare(article.title, article.excerpt)}
                className="w-9 h-9 rounded-full bg-[#e7f0ea] text-[#414844] hover:text-[#012d1d] flex items-center justify-center transition-colors"
                aria-label="Partager cet écrit"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-[#012d1d] text-white font-label-md text-xs font-semibold hover:bg-[#1b4332] transition-colors"
            >
              Fermer la lecture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

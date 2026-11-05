import { useDialog } from '../hooks/useDialog';
import React, { useEffect } from 'react';
import { ArticleItem } from '../types';
import { articleApi } from '../services/articleApi';
import { useContent } from '../features/content/ContentContext';
import { SiteProfileContent } from '../services/contentApi';

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
  const dialogRef = useDialog(onClose);
  const { get } = useContent(); const profile = get<SiteProfileContent>('site.profile');

  useEffect(() => {
    if (!article || !/^[a-f\d]{24}$/i.test(article.id)) return;
    void articleApi.public.view(article.id).catch(() => {
      // A view counter failure must never interrupt reading.
    });
  }, [article?.id]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="article-title" className="w-full max-w-xl bg-[#f3fbf5] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-[#c1c8c2] animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#012d1d] text-white">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#ffca98] text-[20px]">
              menu_book
            </span>
            <span className="font-label-md text-xs font-semibold tracking-wide text-[#ffdcbd] truncate">
              {article.category || 'Nagréogo'}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {/* Hero Image */}
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm bg-[#e2eae4]">
            <img
              src={article.image}
              alt={article.alt}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Title & Metadata */}
          <div>
            <h2 id="article-title" className="font-headline-lg-mobile text-[1.4rem] text-[#012d1d] font-bold leading-tight">
              {article.title}
            </h2>
            <p className="text-xs text-[#7d562d] font-medium mt-1.5">
              {article.date} · {article.author || profile.name}
            </p>
          </div>

          {/* Main Full Text */}
          <div className="font-body-md text-[#414844] space-y-3 leading-relaxed text-[0.9375rem]">
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

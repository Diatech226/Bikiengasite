import React from 'react';
import { useContent } from '../features/content/ContentContext';
import { ArticleItem, VideoItem } from '../types';

interface BookmarksModalProps {
  onClose: () => void;
  articles: ArticleItem[];
  bookmarks: string[];
  onRemoveBookmark: (id: string) => void;
  onSelectVideo: (video: VideoItem) => void;
  onSelectArticle: (article: ArticleItem) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  onClose,
  articles,
  bookmarks,
  onRemoveBookmark,
  onSelectVideo,
  onSelectArticle,
}) => {
  const { media } = useContent();
  const allVideos: VideoItem[] = (['home', 'agriculture', 'elevage', 'humanitaire'] as const).flatMap(media);
  const bookmarkedVideos = allVideos.filter((video) => bookmarks.includes(video.id));
  const bookmarkedArticles = articles.filter((article) => bookmarks.includes(article.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        role="dialog" aria-modal="true" className="w-full max-w-xl bg-[#f3fbf5] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-[#c1c8c2] animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#012d1d] text-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffca98] text-[20px]">
              bookmark
            </span>
            <span className="font-label-md text-xs font-semibold tracking-wide text-[#ffdcbd]">
              Vos Enregistrements ({bookmarks.length})
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 flex flex-col gap-4">
          {bookmarks.length === 0 ? (
            <div className="text-center py-10 text-[#717973] flex flex-col items-center">
              <span className="material-symbols-outlined text-4xl text-[#c1c8c2]">
                bookmark_border
              </span>
              <p className="text-xs mt-2 font-medium">Vous n'avez pas encore d'éléments enregistrés.</p>
              <p className="text-[11px] text-[#717973] mt-1">
                Cliquez sur l'icône de marque-page sur n'importe quel reportage pour le retrouver ici.
              </p>
            </div>
          ) : (
            <>
              {bookmarkedVideos.length > 0 && (
                <div>
                  <span className="font-label-sm text-xs font-bold text-[#7d562d] uppercase tracking-wider block mb-2">
                    Vidéos & Reportages ({bookmarkedVideos.length})
                  </span>
                  <div className="space-y-2">
                    {bookmarkedVideos.map((v) => (
                      <div
                        key={v.id}
                        className="p-2.5 rounded-xl bg-white border border-[#dce5de] flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div
                          onClick={() => {
                            onSelectVideo(v);
                            onClose();
                          }}
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                        >
                          <div className="w-14 h-11 rounded-lg overflow-hidden bg-black flex-shrink-0">
                            <img
                              src={v.image}
                              alt={v.alt}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[10px] text-[#7d562d] font-bold uppercase">
                              {v.tagLabel}
                            </span>
                            <h4 className="text-xs font-bold text-[#012d1d] truncate">
                              {v.title}
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveBookmark(v.id)}
                          aria-label="Supprimer des favoris"
                          className="w-8 h-8 rounded-full text-[#717973] hover:text-red-600 flex items-center justify-center flex-shrink-0"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bookmarkedArticles.length > 0 && (
                <div>
                  <span className="font-label-sm text-xs font-bold text-[#7d562d] uppercase tracking-wider block mb-2">
                    Écrits & Méditations ({bookmarkedArticles.length})
                  </span>
                  <div className="space-y-2">
                    {bookmarkedArticles.map((a) => (
                      <div
                        key={a.id}
                        className="p-2.5 rounded-xl bg-white border border-[#dce5de] flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div
                          onClick={() => {
                            onSelectArticle(a);
                            onClose();
                          }}
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#e7f0ea] flex-shrink-0">
                            <img
                              src={a.image}
                              alt={a.alt}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[10px] text-[#7d562d] font-semibold">
                              {a.date}
                            </span>
                            <h4 className="text-xs font-bold text-[#012d1d] truncate">
                              {a.title}
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveBookmark(a.id)}
                          aria-label="Supprimer des favoris"
                          className="w-8 h-8 rounded-full text-[#717973] hover:text-red-600 flex items-center justify-center flex-shrink-0"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
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

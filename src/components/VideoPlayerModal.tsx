import React from 'react';
import { VideoItem } from '../types';

interface Props { video: VideoItem | null; onClose: () => void; onReadArticle?: (video: VideoItem) => void; isBookmarked: boolean; onToggleBookmark: (id: string, title: string) => void; onShare: (title: string, desc: string) => void }

/** A reportage reader. It deliberately contains no simulated video/audio controls. */
export const VideoPlayerModal: React.FC<Props> = ({ video, onClose, onReadArticle, isBookmarked, onToggleBookmark, onShare }) => {
  if (!video) return null;
  return <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
    <article role="dialog" aria-modal="true" className="w-full max-w-xl bg-[#f3fbf5] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto border border-[#c1c8c2]">
      <header className="flex items-center justify-between px-4 py-3 bg-[#012d1d] text-white">
        <span className="text-xs font-semibold text-[#ffdcbd]">{video.tagLabel}</span>
        <button onClick={onClose} aria-label="Fermer" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white/80 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </header>
      <img src={video.image} alt={video.alt} className="w-full aspect-video object-cover" referrerPolicy="no-referrer" />
      <div className="p-5 flex flex-col gap-4">
        <div>
          <span className="text-xs font-bold uppercase text-[#7d562d]">{video.date}</span>
          <h2 className="text-xl font-bold text-[#012d1d] leading-snug mt-1">{video.title}</h2>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-2 border-t border-[#dce5de] pt-4">
          <div className="flex gap-2">
            <button onClick={() => onToggleBookmark(video.id, video.title)} className="px-3.5 py-1.5 rounded-full bg-[#e7f0ea] text-xs font-semibold text-[#012d1d] hover:bg-[#dce5de] transition-colors">
              {isBookmarked ? 'Enregistré' : 'Enregistrer'}
            </button>
            <button onClick={() => onShare(video.title, video.summary)} className="px-3.5 py-1.5 rounded-full bg-[#e7f0ea] text-xs font-semibold text-[#012d1d] hover:bg-[#dce5de] transition-colors">
              Partager
            </button>
          </div>
          {onReadArticle && (
            <button onClick={() => { onClose(); onReadArticle(video); }} className="px-4 py-1.5 rounded-full bg-[#012d1d] text-white text-xs font-semibold hover:bg-[#1b4332] transition-colors">
              {video.actionText}
            </button>
          )}
        </div>
      </div>
    </article>
  </div>;
};

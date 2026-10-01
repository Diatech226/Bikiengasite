import React from 'react';
import { VideoItem } from '../types';

interface Props { video: VideoItem | null; onClose: () => void; onReadArticle?: (video: VideoItem) => void; isBookmarked: boolean; onToggleBookmark: (id: string, title: string) => void; onShare: (title: string, desc: string) => void }

/** A reportage reader. It deliberately contains no simulated video/audio controls. */
export const VideoPlayerModal: React.FC<Props> = ({ video, onClose, onReadArticle, isBookmarked, onToggleBookmark, onShare }) => {
  if (!video) return null;
  return <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
    <article className="w-full max-w-xl bg-[#f3fbf5] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto border border-[#c1c8c2]">
      <header className="flex items-center justify-between px-4 py-3 bg-[#012d1d] text-white"><span className="text-xs font-bold text-[#ffdcbd]">{video.tagLabel} • Reportage</span><button onClick={onClose} aria-label="Fermer le reportage"><span className="material-symbols-outlined">close</span></button></header>
      <img src={video.image} alt={video.alt} className="w-full aspect-video object-cover" referrerPolicy="no-referrer" />
      <div className="p-5 flex flex-col gap-4"><div><span className="text-xs font-bold uppercase text-[#7d562d]">{video.date}</span><h2 className="text-xl font-bold text-[#012d1d] leading-snug">{video.title}</h2></div><p className="text-sm text-[#414844] leading-relaxed whitespace-pre-line">{video.summary}</p>{video.stats && <p className="rounded-xl bg-[#e7f0ea] p-3 text-sm font-semibold text-[#012d1d]">{video.stats}</p>}
        <div className="flex flex-wrap justify-between gap-2 border-t pt-4"><div className="flex gap-2"><button onClick={() => onToggleBookmark(video.id, video.title)} className="px-3 py-2 rounded-full bg-[#e7f0ea] text-xs font-semibold">{isBookmarked ? 'Enregistré' : 'Enregistrer'}</button><button onClick={() => onShare(video.title, video.summary)} className="px-3 py-2 rounded-full bg-[#e7f0ea] text-xs font-semibold">Partager</button></div>{onReadArticle && <button onClick={() => { onClose(); onReadArticle(video); }} className="px-4 py-2 rounded-full bg-[#012d1d] text-white text-xs font-semibold">{video.actionText}</button>}</div>
      </div>
    </article>
  </div>;
};

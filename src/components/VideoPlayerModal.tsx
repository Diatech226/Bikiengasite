import React, { useState, useEffect } from 'react';
import { VideoItem } from '../types';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
  onReadArticle?: (video: VideoItem) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, title: string) => void;
  onShare: (title: string, desc: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  onClose,
  onReadArticle,
  isBookmarked,
  onToggleBookmark,
  onShare,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(15);
  const [isMuted, setIsMuted] = useState(false);
  const [likes, setLikes] = useState(128);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!video) return null;

  const handleToggleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="w-full max-w-xl bg-[#f3fbf5] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-[#c1c8c2] animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar of modal */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#012d1d] text-white">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffca98] animate-pulse" />
            <span className="font-label-md text-xs font-semibold tracking-wide text-[#ffdcbd] truncate">
              {video.tagLabel} • Diffusion Nagréogo
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer la vidéo"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Video Player Display */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group select-none">
          <img
            src={video.image}
            alt={video.alt}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-102' : 'scale-100 opacity-80'
            }`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Center Play/Pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause' : 'Lecture'}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#ffca98]/95 text-[#7a532a] flex items-center justify-center shadow-2xl transform transition-transform hover:scale-110 active:scale-95"
          >
            <span
              className="material-symbols-outlined text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#012d1d]/80 text-[#c1ecd4] font-label-sm text-[11px] backdrop-blur-md flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[13px]">{video.tagIcon}</span>
              {video.tagLabel}
            </span>
            {isPlaying && (
              <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white font-label-sm text-[10px] tracking-wider uppercase font-bold animate-pulse">
                En lecture
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            <span className="px-2 py-1 rounded bg-black/60 text-white font-label-sm text-[11px]">
              {video.duration}
            </span>
          </div>

          {/* Bottom Scrub bar */}
          <div className="absolute bottom-0 inset-x-0 p-3 flex flex-col gap-1.5 bg-gradient-to-t from-black/90 to-transparent">
            <div className="relative w-full h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-[#ffca98] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/90 font-label-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">visibility</span>
                {video.views}
              </span>
              <span>{video.badgeSubtitle || 'Nagréogo Direct'}</span>
            </div>
          </div>
        </div>

        {/* Info & Details Body */}
        <div className="p-4 overflow-y-auto max-h-[45vh] flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="font-label-sm text-xs font-bold text-[#7d562d] uppercase tracking-wider block">
                {video.date}
              </span>
              <h3 className="font-headline-sm text-[1.125rem] text-[#012d1d] font-bold mt-0.5 leading-snug">
                {video.title}
              </h3>
            </div>
          </div>

          <p className="font-body-md text-[0.875rem] text-[#414844] leading-relaxed">
            {video.summary}
          </p>

          {video.stats && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#e7f0ea] text-[#012d1d] font-label-md text-xs font-semibold">
              <span className="material-symbols-outlined text-[#7d562d] text-[18px]">
                {video.statsIcon || 'verified'}
              </span>
              <span>Indicateur clé : {video.stats}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-[#dce5de]">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  hasLiked
                    ? 'bg-[#ffca98] text-[#7a532a]'
                    : 'bg-[#e7f0ea] text-[#414844] hover:text-[#012d1d]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: hasLiked ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
                <span>{likes}</span>
              </button>

              <button
                onClick={() => onToggleBookmark(video.id, video.title)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isBookmarked
                    ? 'bg-[#012d1d] text-white'
                    : 'bg-[#e7f0ea] text-[#414844] hover:text-[#012d1d]'
                }`}
                aria-label="Enregistrer dans les favoris"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                >
                  bookmark
                </span>
              </button>

              <button
                onClick={() => onShare(video.title, video.summary)}
                className="w-9 h-9 rounded-full bg-[#e7f0ea] text-[#414844] hover:text-[#012d1d] flex items-center justify-center transition-colors"
                aria-label="Partager la vidéo"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
            </div>

            {onReadArticle && (
              <button
                onClick={() => {
                  onClose();
                  onReadArticle(video);
                }}
                className="px-4 py-2 rounded-full bg-[#012d1d] text-white font-label-md text-xs font-semibold hover:bg-[#1b4332] flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Lire le récit complet</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

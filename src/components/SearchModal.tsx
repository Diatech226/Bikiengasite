import React, { useMemo, useState } from 'react';
import { useContent } from '../features/content/ContentContext';
import { ArticleItem, VideoItem } from '../types';
import { SiteSearchContent } from '../services/contentApi';

interface Props { articles: ArticleItem[]; onClose: () => void; onSelectVideo: (video: VideoItem) => void; onSelectArticle: (article: ArticleItem) => void }
export const SearchModal: React.FC<Props> = ({ articles, onClose, onSelectVideo, onSelectArticle }) => {
  const { get, media } = useContent(); const copy = get<SiteSearchContent>('site.search'); const [query, setQuery] = useState('');
  const videos = useMemo(() => ['home','agriculture','elevage','humanitaire'].flatMap((section) => media(section as 'home')), [media]);
  const normalized = query.trim().toLocaleLowerCase('fr');
  const foundVideos = normalized ? videos.filter((v) => [v.title,v.summary,v.tagLabel].some((text) => text.toLocaleLowerCase('fr').includes(normalized))) : [];
  const foundArticles = normalized ? articles.filter((a) => (a.status || 'published') === 'published' && [a.title,a.excerpt,a.fullText,a.category].some((text) => text.toLocaleLowerCase('fr').includes(normalized))) : [];
  return <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-16"><div role="dialog" aria-modal="true" aria-label="Recherche" className="w-full max-w-xl bg-[#f3fbf5] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border">
    <div className="p-3 bg-white border-b flex items-center gap-2"><span className="material-symbols-outlined">search</span><input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={copy.placeholder} className="flex-1 bg-transparent text-sm focus:outline-none"/>{query && <button onClick={()=>setQuery('')} className="text-xs">Effacer</button>}<button onClick={onClose} aria-label="Fermer"><span className="material-symbols-outlined">close</span></button></div>
    <div className="overflow-y-auto p-4 flex flex-col gap-4">{!normalized ? <div><strong className="text-xs uppercase text-[#7d562d]">{copy.suggestionsTitle}</strong><div className="flex flex-wrap gap-2 mt-2">{(copy.suggestions || []).map((term)=><button key={term} onClick={()=>setQuery(term)} className="px-3 py-1.5 rounded-full bg-[#e7f0ea] text-xs font-semibold">{term}</button>)}</div></div> : <>
      {!foundVideos.length && !foundArticles.length && <p className="text-center py-8 text-sm text-gray-500">{copy.emptyMessage} « {query} »</p>}
      {!!foundVideos.length && <section><strong className="text-xs uppercase text-[#7d562d]">{copy.mediaTitle} ({foundVideos.length})</strong><div className="space-y-2 mt-2">{foundVideos.map((v)=><button key={`${v.sector}-${v.id}`} onClick={()=>{onSelectVideo(v);onClose();}} className="w-full p-2 rounded-xl bg-white flex gap-3 text-left"><img src={v.image} alt={v.alt} className="w-16 h-12 rounded object-cover"/><span><small>{v.tagLabel} • {v.duration}</small><b className="block text-xs">{v.title}</b></span></button>)}</div></section>}
      {!!foundArticles.length && <section><strong className="text-xs uppercase text-[#7d562d]">{copy.articlesTitle} ({foundArticles.length})</strong><div className="space-y-2 mt-2">{foundArticles.map((a)=><button key={a.id} onClick={()=>{onSelectArticle(a);onClose();}} className="w-full p-2 rounded-xl bg-white flex gap-3 text-left"><img src={a.image} alt={a.alt} className="w-12 h-12 rounded object-cover"/><span><small>{a.date} • {a.readTime}</small><b className="block text-xs">{a.title}</b></span></button>)}</div></section>}
    </>}</div></div></div>;
};

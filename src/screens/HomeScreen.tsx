import React from 'react';
import { useContent } from '../features/content/ContentContext';
import { ArticleItem, VideoItem } from '../types';
import { HomePageContent } from '../services/contentApi';

interface Props { articles: ArticleItem[]; onOpenVideo:(v:VideoItem)=>void; onOpenArticle:(a:ArticleItem)=>void; onOpenDonation:()=>void; onOpenAdmin:()=>void; bookmarks:string[]; onToggleBookmark:(id:string,title:string)=>void; onShare:(title:string,desc:string)=>void; articlesLoading:boolean; articlesError:string|null; onRetryArticles:()=>void }
export const HomeScreen: React.FC<Props> = ({ articles,onOpenVideo,onOpenArticle,onOpenDonation,onOpenAdmin,articlesLoading,articlesError,onRetryArticles }) => {
  const { get, media } = useContent(); const page=get<HomePageContent>('home.page'); const stories=media('home').slice(0,3);
  return <div className="public-page">
    <section className="public-hero"><p className="eyebrow">{page.badge}</p><h1>{page.title}</h1><p>{page.description}</p><div className="simple-actions"><button className="primary-action" onClick={onOpenDonation}>{page.primaryButton}</button><button className="text-action" onClick={()=>articles[0]&&onOpenArticle(articles[0])} disabled={!articles.length}>{page.secondaryButton}</button></div></section>
    <section className="public-intro"><blockquote>{page.quote}</blockquote><p>{page.quoteAuthor}</p><small>{page.quoteCaption}</small></section>
    <section><div className="section-heading"><h2>{page.impactTitle}</h2><span>{page.impactPeriod}</span></div><div className="metric-line">{page.metrics.slice(0,4).map((m,i)=><div key={i}><strong>{m.value}</strong><span>{m.label}</span></div>)}</div></section>
    <section><div className="section-heading"><h2>{page.storiesTitle}</h2></div><div className="editorial-grid">{stories.map(v=><article key={v.id} className="editorial-item" onClick={()=>onOpenVideo(v)}><img src={v.image} alt={v.alt}/><p className="eyebrow">{v.tagLabel}</p><h3>{v.title}</h3><p>{v.summary}</p></article>)}</div></section>
    <section><div className="section-heading"><div><p className="eyebrow">{page.articlesEyebrow}</p><h2>{page.articlesHeading}</h2></div></div>{articlesLoading?<p>{page.articlesLoadingLabel}</p>:articlesError?<div className="inline-error"><p>{page.articlesErrorLabel}</p><button onClick={onRetryArticles}>{page.retryLabel}</button></div>:articles.length?<div className="article-list">{articles.slice(0,3).map(a=><button key={a.id} onClick={()=>onOpenArticle(a)}><span>{a.category} · {a.date}</span><strong>{a.title}</strong><p>{a.excerpt}</p></button>)}</div>:<div className="inline-error"><p>{page.emptyArticlesTitle}</p><button onClick={onOpenAdmin}>{page.emptyArticlesButton}</button></div>}</section>
    <section className="final-cta"><div><p className="eyebrow">{page.upcomingEyebrow}</p><h2>{page.upcomingTitle}</h2><p>{page.upcomingDescription}</p></div><button className="primary-action" onClick={onOpenDonation}>{page.upcomingPrimaryButton}</button></section>
  </div>;
};

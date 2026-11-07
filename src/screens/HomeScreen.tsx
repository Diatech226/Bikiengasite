import React from 'react';
import { useContent } from '../features/content/ContentContext';
import { ArticleItem, VideoItem } from '../types';
import { HomePageContent } from '../services/contentApi';

interface Props {
  articles: ArticleItem[];
  onOpenVideo: (video: VideoItem) => void;
  onOpenArticle: (article: ArticleItem) => void;
  onOpenDonation: () => void;
  onParticipateProject: (project: VideoItem) => void;
  articlesLoading: boolean;
  articlesError: string | null;
  onRetryArticles: () => void;
}

export const HomeScreen: React.FC<Props> = ({ articles, onOpenVideo, onOpenArticle, onOpenDonation, onParticipateProject, articlesLoading, articlesError, onRetryArticles }) => {
  const { get, media } = useContent();
  const page = get<HomePageContent>('home.page');
  const stories = media('home').filter((item) => item.type !== 'projet').slice(0, 3);
  const projects = media(undefined, 'projet');

  return <div className="public-page">
    <section className="public-hero" aria-labelledby="home-title">
      <p className="eyebrow">{page.badge}</p>
      <h1 id="home-title">{page.title}</h1>
      <p>{page.description}</p>
      <div className="simple-actions"><button className="primary-action" onClick={() => document.querySelector('#chantiers')?.scrollIntoView({ behavior: 'smooth' })}>{page.primaryButton}</button></div>
    </section>
    <section className="public-intro" aria-label="Présentation">
      <blockquote>{page.quote}</blockquote><p>{page.quoteAuthor}</p><small>{page.quoteCaption}</small>
    </section>
    <section aria-labelledby="impact-title">
      <div className="section-heading"><h2 id="impact-title">{page.impactTitle}</h2><span>{page.impactPeriod}</span></div>
      <div className="metric-line">{page.metrics.slice(0, 4).map((metric) => <div key={`${metric.value}-${metric.label}`}><strong>{metric.value}</strong><span>{metric.label}</span>{metric.sublabel && <small>{metric.sublabel}</small>}</div>)}</div>
    </section>
    <section aria-labelledby="stories-title">
      <div className="section-heading"><h2 id="stories-title">{page.storiesTitle}</h2></div>
      <div className="editorial-grid">{stories.map((story) => <button type="button" key={story.id} className="editorial-item" onClick={() => onOpenVideo(story)}><img src={story.image} alt={story.alt}/><span className="eyebrow">{story.tagLabel}</span><strong>{story.title}</strong><span className="editorial-summary">{story.summary}</span></button>)}</div>
    </section>
    <section id="chantiers" className="scroll-mt-24" aria-labelledby="projects-title">
      <div className="section-heading"><div><h2 id="projects-title">{page.projectsTitle}</h2><p>{page.projectsDescription}</p></div></div>
      {projects.length ? <div className="project-list">{projects.map((project) => <article key={project.id} className="project-item"><div><p className="eyebrow">{project.tagLabel || project.sector}</p><h3>{project.title}</h3><p>{project.summary}</p>{project.date && <small>{project.date}</small>}</div><div className="simple-actions"><button className="text-action" onClick={() => onOpenVideo(project)}>{page.projectActionLabel}</button><button className="primary-action" onClick={() => onParticipateProject(project)}>{page.participateLabel}</button></div></article>)}</div> : <p className="empty-state">{page.projectsEmptyLabel}</p>}
    </section>
    <section aria-labelledby="articles-title">
      <div className="section-heading"><div><p className="eyebrow">{page.articlesEyebrow}</p><h2 id="articles-title">{page.articlesHeading}</h2></div></div>
      {articlesLoading ? <p role="status">{page.articlesLoadingLabel}</p> : articlesError ? <div className="inline-error" role="alert"><p>{page.articlesErrorLabel}</p><button onClick={onRetryArticles}>{page.retryLabel}</button></div> : articles.length ? <div className="article-list">{articles.slice(0, 3).map((article) => <button key={article.id} onClick={() => onOpenArticle(article)}><span>{article.category} · {article.date}</span><strong>{article.title}</strong><span>{article.excerpt}</span></button>)}</div> : <div className="inline-error"><p>{page.emptyArticlesTitle}</p><p>{page.emptyArticlesDescription}</p></div>}
    </section>
    <section className="final-cta" aria-labelledby="home-cta-title"><div><p className="eyebrow">{page.upcomingEyebrow}</p><h2 id="home-cta-title">{page.upcomingTitle}</h2><p>{page.upcomingDescription}</p></div><button className="primary-action" onClick={onOpenDonation}>{page.upcomingPrimaryButton}</button></section>
  </div>;
};

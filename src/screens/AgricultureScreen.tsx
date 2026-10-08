import React from 'react';
import { useContent } from '../features/content/ContentContext';
import { AgriculturePageContent } from '../services/contentApi';
import { VideoItem } from '../types';

interface Props { onOpenVideo: (video: VideoItem) => void; onOpenGuide: () => void }

export const AgricultureScreen: React.FC<Props> = ({ onOpenVideo, onOpenGuide }) => {
  const { get, media } = useContent();
  const page = get<AgriculturePageContent>('agriculture.page');
  const stories = media('agriculture') as VideoItem[];
  return <div className="public-page">
    <section className="public-hero"><p className="eyebrow">{page.header.badge}</p><h1>{page.header.title}</h1><p>{page.header.description}</p></section>
    <section aria-label="Chiffres clés"><div className="metric-line">{page.stats.slice(0, 3).map((stat) => <div key={`${stat.value}-${stat.label}`}><strong>{stat.value}</strong><span>{stat.label}</span>{stat.sub && <small>{stat.sub}</small>}</div>)}</div></section>
    <section><div className="section-heading"><h2>{page.storiesTitle}</h2></div><div className="editorial-grid">{stories.map((story) => <button type="button" className="editorial-item" key={story.id} onClick={() => onOpenVideo(story)}><img src={story.image} alt={story.alt}/><span className="eyebrow">{story.tagLabel}</span><strong>{story.title}</strong><span className="editorial-summary">{story.summary}</span></button>)}</div></section>
    <section className="useful-guide"><div><p className="eyebrow">{page.guideCard.badge}</p><h2>{page.guideCard.title}</h2><p>{page.guideCard.description}</p><small>{page.guideCard.fileLabel}</small></div><button className="primary-action" onClick={onOpenGuide}>{page.guideCard.buttonLabel}</button></section>
  </div>;
};

import React from 'react';
import { useContent } from '../features/content/ContentContext';
import { ElevagePageContent } from '../services/contentApi';
import { VideoItem } from '../types';

interface Props { onOpenVideo: (video: VideoItem) => void; onOpenDonation: () => void }

export const ElevageScreen: React.FC<Props> = ({ onOpenVideo, onOpenDonation }) => {
  const { get, media } = useContent();
  const page = get<ElevagePageContent>('elevage.page');
  const stories = media('elevage') as VideoItem[];
  return <div className="public-page">
    <section className="public-hero"><p className="eyebrow">{page.header.badge}</p><h1>{page.header.title}</h1><p>{page.header.description}</p></section>
    <section aria-label="Chiffres clés"><div className="metric-line">{page.stats.slice(0, 3).map((stat) => <div key={`${stat.value}-${stat.label}`}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div></section>
    <section><div className="section-heading"><h2>{page.storiesTitle}</h2></div><div className="editorial-grid">{stories.map((story) => <button type="button" className="editorial-item" key={story.id} onClick={() => onOpenVideo(story)}><img src={story.image} alt={story.alt}/><span className="eyebrow">{story.tagLabel}</span><strong>{story.title}</strong><span className="editorial-summary">{story.summary}</span></button>)}</div></section>
    <section><div className="section-heading"><h2>{page.adviceTitle}</h2></div><ol className="advice-list">{page.rules.map((rule) => <li key={rule.title}><h3>{rule.title}</h3><p>{rule.description}</p></li>)}</ol></section>
    <section className="final-cta"><div><h2>{page.ctaTitle}</h2><p>{page.ctaDescription}</p></div><button className="primary-action" onClick={onOpenDonation}>{page.donationButton}</button></section>
  </div>;
};

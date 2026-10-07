import React from 'react';
import { useContent } from '../features/content/ContentContext';
import { HumanitairePageContent, SiteContactContent } from '../services/contentApi';
import { VideoItem } from '../types';

interface Props { onOpenVideo: (video: VideoItem) => void; onOpenDonation: () => void }

export const HumanitaireScreen: React.FC<Props> = ({ onOpenVideo, onOpenDonation }) => {
  const { get, media } = useContent();
  const page = get<HumanitairePageContent>('humanitaire.page');
  const contact = get<SiteContactContent>('site.contact');
  const stories = media('humanitaire') as VideoItem[];
  return <div className="public-page">
    <section className="public-hero"><p className="eyebrow">{page.header.badge}</p><h1>{page.header.title}</h1><p>{page.header.description}</p></section>
    <section aria-label="Chiffres clés"><div className="metric-line">{page.stats.slice(0, 3).map((stat) => <div key={`${stat.value}-${stat.label}`}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div></section>
    <section><div className="section-heading"><div><h2>{page.chroniclesTitle}</h2><p>{page.chroniclesSubtitle}</p></div></div><div className="editorial-grid">{stories.map((story) => <button type="button" className="editorial-item" key={story.id} onClick={() => onOpenVideo(story)}><img src={story.image} alt={story.alt}/><span className="eyebrow">{story.tagLabel}</span><strong>{story.title}</strong><p>{story.summary}</p></button>)}</div></section>
    <section className="final-cta"><div><p className="eyebrow">{page.actionSubtitle}</p><h2>{page.actionTitle}</h2><p>{page.actionDescription}</p><p className="contact-line"><span>{contact.location}</span>{contact.email && <> · <a href={`mailto:${contact.email}`}>{contact.email}</a></>}{contact.phone && <> · <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></>}</p></div><div className="simple-actions"><button className="primary-action" onClick={onOpenDonation}>{page.donationButton}</button>{contact.email && <a className="text-action" href={`mailto:${contact.email}`}>{page.contactButton}</a>}</div></section>
  </div>;
};

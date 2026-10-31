import React, { useState } from 'react';
import { useContent } from '../features/content/ContentContext';
import { SiteContactContent, SiteDonationContent } from '../services/contentApi';

export interface ProjectData {
  id: string;
  category: string;
  badge: string;
  badgeIcon: string;
  title: string;
  summary: string;
  description: string;
  metric: string;
  metricLabel: string;
  imageUrl: string;
  imageAlt: string;
  actionText: string;
}

const PROJECTS_LIST: ProjectData[] = [
  {
    id: 'projet-forage',
    category: 'forage',
    badge: 'Bataille de l’Eau',
    badgeIcon: 'water_drop',
    title: "Bataille de l’Eau : Forage Solaire Autonome",
    summary: "Conquête populaire de l'eau potable par pompage solaire pour libérer 600 femmes de la corvée et irriguer les potagers collectifs.",
    description: "L'accès à l'eau est un droit inaliénable du peuple. Ce chantier populaire comprend un forage profond à 75 mètres, un groupe de pompage 100% solaire, un château d'eau de 20 000 litres et 6 bornes-fontaines réparties entre les quartiers populaires et l'école primaire.",
    metric: '40 000 L / jour',
    metricLabel: 'Eau potable disponible sans corvée',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfBDBAqZcO7YgSdsJzyihBipspJzBKX2tM6M1vBSFNkBACdNeCFUbO9tiqh_clnwqSUNV9_q3RvyGFoYmUQEDKomHkAgNEIOWukf9G1_wyvpWovNEYLKw27B2SbrJtyl9qnM0B4AUwdMS__rb9_T4PX1Nl7HcM1Gxl8cjh2BESylOxPbYcpASLHMynJPs0pUMeTFaxqopmA6slY2iuWghKfcxowO5SD8tB5oYGnTDMGeE8ZtROGHgy',
    imageAlt: "Inauguration d'un forage solaire avec grand réservoir d'eau à Nagréogo",
    actionText: 'Rejoindre ce chantier d’eau',
  },
  {
    id: 'projet-cereales',
    category: 'cereales',
    badge: 'Résistance Céréalière',
    badgeIcon: 'grain',
    title: 'Banque Céréalière Populaire & Grenier de Résistance',
    summary: 'Achat direct aux producteurs et stockage stratégique de sorgho et maïs pour briser la spéculation marchande et vaincre la soudure.',
    description: "Pour terrasser la spéculation des marchands d'illusions, la banque populaire centralise les récoltes de sorgho et maïs du village dans des silos traditionnels améliorés sans produits toxiques, afin de garantir le grain aux familles lors de la période critique.",
    metric: '850 tonnes',
    metricLabel: 'Réserve populaire pour 350 familles',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5q2yx5wsiqlpT7VpGnebaFut4CKHpTeH0ensmiHKR5yYrBKblGPwBNVnFXgE6hl2e1UUcoQ_nFPNPu7V7RZmcDwUbyVTGyq70ub_1f0fOOnisUpLDyMA9XktmxY-aIQazXyir8Z1R0yGjXmvFxV1HgxeoQ99T2LiI42qFWrA_tBhTdyqBT0ZDKMFpQ2EBb6rDTtgbHUJ0rFpw1KXMWfcdVqXLxoQYCvDsK8Jgu3yG2qcFS8g7GbQg',
    imageAlt: 'Récoltes abondantes de céréales locales à Nagréogo',
    actionText: 'Renforcer le grenier populaire',
  },
  {
    id: 'projet-orphelins',
    category: 'orphelins',
    badge: 'Éducation Productive',
    badgeIcon: 'school',
    title: 'Kits Scolaires Populaires & École Productive',
    summary: 'Lier le livre et la houe : manuels scolaires, cartables en Faso Dan Fani, bourses et parcelles maraîchères pour 220 enfants du peuple.',
    description: "Former une jeunesse patriote, instruite et enracinée dans sa terre. Votre soutien finance les fournitures de classe, les vélos pour les élèves des hameaux reculés et le matériel pour la parcelle maraîchère pédagogique de l'école.",
    metric: '220 élèves',
    metricLabel: 'Équipés et formés à l’agro-écologie',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGorMf5wF_lpzJqt4-wOKDVeknMUn4HfbVENlCvq4LkahvCIkkPZMqXXKlyziLqeGpKCzf8cae384uCbPmKUubYxfVxMH1XiY_8lvjIMOY3yVz47S2hwPSb5jaLRQTAE40pwfozfpLP_pzY63PDov5qRr5dMHuO0Q60DXwWXebh8cu49KXtZDDQp5qP2VwGxkeIa3fN_gNbJjWOxs8cd03Vqc73khhuDZxjRgRBVTExKFXU7s7nqGH',
    imageAlt: 'Éducation et accompagnement des jeunes à Nagréogo',
    actionText: 'Équiper un jeune écolier',
  },
  {
    id: 'projet-arbres',
    category: 'arbres',
    badge: 'Reforestation Patriotique',
    badgeIcon: 'park',
    title: 'Bocage Sahélien & Offensive des 10 000 Arbres',
    summary: "Plantation patriotique d'arbres fertilisants (Faidherbia albida) et fruitiers pour faire barrage au désert et fertiliser les sols vivriers.",
    description: "Appliquant les 3 luttes populaires contre la désertification (contre la coupe abusive, les feux de brousse et la divagation), les pépinières populaires de Nagréogo produisent néré, baobab et Gaao pour créer des haies vives et régénérer le microclimat sahélien.",
    metric: '+12 000 arbres',
    metricLabel: 'Plantés et surveillés par le peuple',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB26R7xCT8sbhrHJ4WWKfSAgue2BO3X98MShxKFasxgaBD1phMVkNpYIfc0jyzYAjMubZEGgXoHmg5Z9Jo_4qa1i1TqWT7zZJCyP0wbL3b-mZ3-b-gN3VqHPWuqk64MTktvbcV6rRkiuYkxV1QplLI3qvFOwrfmt0CMf8QgILQ9Ch0lT08gGUZwVa6eeJ2dHYEfVGKZDxQGKiZV1cyLTL1qaq22hxmSX82lN58ebMdWy9ZveYDHiweS',
    imageAlt: 'Arbres et végétation verdoyante régénérant la terre sahélienne',
    actionText: 'Planter des arbres au Faso',
  },
  {
    id: 'projet-materiel',
    category: 'materiel',
    badge: 'Machinisme Agricole Paysan',
    badgeIcon: 'precision_manufacturing',
    title: 'Outillage Agricole & Machinisme Paysan Adapté',
    summary: 'Fourniture de charrues adaptées, composteurs, motopompes solaires et semences paysannes pour la réhabilitation des zipellés.',
    description: "Le travail de la terre et les fosses fumières villageoises redonnent vie aux terres latéritiques indurées. Votre apport équipe les groupements paysans en outillage forgé localement, semences locales certifiées et matériel d'épandage de compost organique.",
    metric: '450 hectares',
    metricLabel: 'Zipellés régénérés et cultivés',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5q2yx5wsiqlpT7VpGnebaFut4CKHpTeH0ensmiHKR5yYrBKblGPwBNVnFXgE6hl2e1UUcoQ_nFPNPu7V7RZmcDwUbyVTGyq70ub_1f0fOOnisUpLDyMA9XktmxY-aIQazXyir8Z1R0yGjXmvFxV1HgxeoQ99T2LiI42qFWrA_tBhTdyqBT0ZDKMFpQ2EBb6rDTtgbHUJ0rFpw1KXMWfcdVqXLxoQYCvDsK8Jgu3yG2qcFS8g7GbQg',
    imageAlt: 'Terres arables régénérées et outillage agricole paysan',
    actionText: 'Doter les paysans en matériel',
  },
];

interface ProjetsScreenProps {
  onSelectProject: (category: string) => void;
  onBackToHome: () => void;
}

export const ProjetsScreen: React.FC<ProjetsScreenProps> = ({ onSelectProject, onBackToHome }) => {
  const { get } = useContent();
  const contact = get<SiteContactContent>('site.contact');
  const donation = get<SiteDonationContent>('site.donation');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredProjects = selectedFilter === 'all'
    ? PROJECTS_LIST
    : PROJECTS_LIST.filter((p) => p.category === selectedFilter);

  return (
    <div className="public-page">
      {/* Top Navigation & Header */}
      <section className="public-hero" aria-labelledby="projets-title">
        <div className="mb-4">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#012d1d] hover:text-[#7d562d] transition-colors py-1 group"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
            <span>Retour à l’accueil</span>
          </button>
        </div>

        <p className="eyebrow">{donation.badge || 'Chantiers Populaires • Nagréogo'}</p>
        <h1 id="projets-title">Choisir le chantier populaire à soutenir</h1>
        <p>
          Chaque contribution va directement aux chantiers d’autosuffisance et de souveraineté populaire à Nagréogo, sous la conduite du Cheick Bikienga Seydou et des assemblées paysannes. Choisissez le front de la terre que vous souhaitez renforcer.
        </p>

        {/* Categories Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-2">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-[#012d1d] text-white shadow-xs'
                : 'bg-white text-[#414844] border border-[#c1c8c2] hover:bg-[#e7f0ea]'
            }`}
          >
            Tous les projets ({PROJECTS_LIST.length})
          </button>
          {PROJECTS_LIST.map((proj) => (
            <button
              type="button"
              key={proj.category}
              onClick={() => setSelectedFilter(proj.category)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedFilter === proj.category
                  ? 'bg-[#012d1d] text-white shadow-xs'
                  : 'bg-white text-[#414844] border border-[#c1c8c2] hover:bg-[#e7f0ea]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{proj.badgeIcon}</span>
              <span>{proj.title.split('&')[0].trim()}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Projects Cards Grid */}
      <section aria-labelledby="cards-heading">
        <div className="section-heading">
          <h2 id="cards-heading">Chantiers prioritaires en cours</h2>
          <span>{filteredProjects.length} initiative{filteredProjects.length > 1 ? 's' : ''} active{filteredProjects.length > 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-[#ccd5cf] overflow-hidden flex flex-col shadow-xs hover:shadow-md transition-shadow group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#e7f0ea]">
                <img
                  src={project.imageUrl}
                  alt={project.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#012d1d]/85 text-white backdrop-blur-xs text-[11px] font-semibold tracking-wide">
                  <span className="material-symbols-outlined text-[14px] text-[#ffca98]">{project.badgeIcon}</span>
                  <span>{project.badge}</span>
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-[#012d1d] leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#59625d] leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#edf6ef] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#66706a]">Impact visé :</span>
                    <strong className="text-[#012d1d] font-bold">{project.metric}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProject(project.category)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#012d1d] text-white hover:bg-[#1b4332] font-semibold text-xs tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 group-hover:bg-[#1b4332]"
                  >
                    <span>{project.actionText}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reassurance & Direct Engagement Section */}
      <section className="final-cta" aria-labelledby="transparency-title">
        <div>
          <h2 id="transparency-title">Engagement de transparence et suivi direct</h2>
          <p>
            Chaque intention de soutien est transmise au secrétariat du Cheick Bikienga Seydou à Nagréogo. Vous êtes recontacté directement via WhatsApp ou téléphone pour valider les modalités et recevoir les échos photographiques des réalisations.
          </p>
          <p className="contact-line">
            {contact.location} ·{' '}
            <a href={`mailto:${contact.email}`}>{contact.email}</a> ·{' '}
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
          </p>
        </div>
        <div className="simple-actions">
          <button
            type="button"
            className="primary-action"
            onClick={() => onSelectProject('forage')}
          >
            Faire un don direct
          </button>
          <button
            type="button"
            className="text-action"
            onClick={onBackToHome}
          >
            Retour à l’accueil
          </button>
        </div>
      </section>
    </div>
  );
};

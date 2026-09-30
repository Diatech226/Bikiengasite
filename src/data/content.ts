import { ArticleItem, MetricCard, VideoItem } from '../types';

export const APP_ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1VQGm1R3RM_VTIpjSWDcb0SM3u3AEDmGnte9U57zQR6THPlcTOl1inAt-xYKwshRww-PcbtbVgdlmn1EJnB2iO9fRkK4X_9JxlQ0E9cYuzqFgyu1CbkIqhXXBvsJ3KMdjDlRUt_Nli2QZAiktbwOA7eL6_g2IO9S1aFi61o6M_uaWSaRiboBiZFd-KJPoIiRmZbQPDgocpqTN_eSWT8whk14uS73ldh95ehq3gGuIRTG1kZbCPrSPEQobU',
  profile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGorMf5wF_lpzJqt4-wOKDVeknMUn4HfbVENlCvq4LkahvCIkkPZMqXXKlyziLqeGpKCzf8cae384uCbPmKUubYxfVxMH1XiY_8lvjIMOY3yVz47S2hwPSb5jaLRQTAE40pwfozfpLP_pzY63PDov5qRr5dMHuO0Q60DXwWXebh8cu49KXtZDDQp5qP2VwGxkeIa3fN_gNbJjWOxs8cd03Vqc73khhuDZxjRgRBVTExKFXU7s7nqGH',
};

export const HOME_METRICS: MetricCard[] = [
  {
    value: '+450 Ha',
    label: 'Terres cultivées',
    sublabel: 'Restauration Zaï',
    icon: 'eco',
    bgColor: 'bg-[#1b4332] text-white',
    textColor: 'text-[#c1ecd4]',
  },
  {
    value: '38',
    label: 'Forages & Puits',
    sublabel: 'Adduction solaire',
    icon: 'water_drop',
    bgColor: 'bg-[#7d562d] text-white',
    textColor: 'text-[#ffdcbd]',
  },
  {
    value: '+1 200',
    label: 'Têtes de bétail',
    sublabel: 'Embouche saine',
    icon: 'cruelty_free',
    bgColor: 'bg-[#dce5de] text-[#151d1a]',
    textColor: 'text-[#414844]',
  },
  {
    value: '15 000+',
    label: 'Bénéficiaires',
    sublabel: 'Rayonnement provincial',
    icon: 'groups',
    bgColor: 'bg-[#00452e] text-white',
    textColor: 'text-[#b1f0ce]',
  },
];

export const HOME_VIDEOS: VideoItem[] = [
  {
    id: 'recette-mais-sorgho-2024',
    title: "Grande récolte de maïs et sorgho 2024 : le défi de l'autosuffisance relevé à Nagréogo",
    category: 'agriculture video',
    sector: 'agriculture',
    tagLabel: 'Agriculture',
    tagIcon: 'eco',
    duration: '04:15',
    views: '14.2k vues',
    badgeSubtitle: 'Campagne Saisonnière 2024',
    date: 'Novembre 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5q2yx5wsiqlpT7VpGnebaFut4CKHpTeH0ensmiHKR5yYrBKblGPwBNVnFXgE6hl2e1UUcoQ_nFPNPu7V7RZmcDwUbyVTGyq70ub_1f0fOOnisUpLDyMA9XktmxY-aIQazXyir8Z1R0yGjXmvFxV1HgxeoQ99T2LiI42qFWrA_tBhTdyqBT0ZDKMFpQ2EBb6rDTtgbHUJ0rFpw1KXMWfcdVqXLxoQYCvDsK8Jgu3yG2qcFS8g7GbQg',
    alt: 'Vaste étendue de champs de sorgho et maïs dorés sous le soleil radieux sahélien au Burkina Faso à Nagréogo. Des agriculteurs souriants célèbrent la moisson abondante.',
    summary: "Grâce à l'impulsion spirituelle et agronomique du Cheick Bikienga, les sols autrefois arides produisent désormais des rendements sans précédent. Plus de 350 familles paysannes ont bénéficié de semences améliorées, d'un encadrement rigoureux et de techniques de rétention des eaux de ruissellement.",
    fullText: `À Nagréogo, la saison des moissons 2024 a consacré une révolution silencieuse. Là où la croûte latéritique aride repoussait autrefois la charrue, de denses tiges de maïs jaune et d'imposantes panicules de sorgho blanc ondulent fièrement sous le vent chaud du Sahel.

Sous la direction méthodologique et spirituelle du Cheick Seydou Bikienga, les comités villageois ont combiné deux techniques maîtresses : le Zaï motorisé préalable aux pluies et la fumure organique enrichie produite par les étables modèles locales.

Les résultats chiffrés attestent du succès :
- Plus de 450 hectares reverdis et fertiles.
- 1 800 à 2 100 kg récoltés par hectare, contre 450 kg selon les méthodes traditionnelles non amendées.
- Une réserve stratégique de 850 tonnes transférée aux banques de céréales communautaires pour garantir l'alimentation durant la soudure.

« Lorsque le cœur est purifié et que la main travaille avec constance, la terre ne trahit jamais l'homme », a rappelé le Cheick lors de la bénédiction des premières gerbes.`,
    actionText: "Lire l'article complet",
    stats: '1 800 kg/ha moyen',
    statsIcon: 'verified',
  },
  {
    id: 'inauguration-forage-solaire-chateau-eau',
    title: "Inauguration du forage solaire et du château d'eau : l'or bleu au cœur des villages",
    category: 'humanitaire video',
    sector: 'humanitaire',
    tagLabel: 'Humanitaire',
    tagIcon: 'water_drop',
    duration: '06:20',
    views: '8.7k vues',
    badgeSubtitle: 'Eau de Source & Vie',
    date: 'Octobre 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfBDBAqZcO7YgSdsJzyihBipspJzBKX2tM6M1vBSFNkBACdNeCFUbO9tiqh_clnwqSUNV9_q3RvyGFoYmUQEDKomHkAgNEIOWukf9G1_wyvpWovNEYLKw27B2SbrJtyl9qnM0B4AUwdMS__rb9_T4PX1Nl7HcM1Gxl8cjh2BESylOxPbYcpASLHMynJPs0pUMeTFaxqopmA6slY2iuWghKfcxowO5SD8tB5oYGnTDMGeE8ZtROGHgy',
    alt: "Inauguration festive d'un forage solaire avec grand château d'eau bleu ciel à Nagréogo Burkina Faso. Enfants et villageoises recueillent avec joie de l'eau claire et limpide.",
    summary: "Un nouvel ouvrage hydraulique solaire capable de fournir 40 000 litres d'eau potable par jour. Ce don met fin aux longues marches pénibles des mères et des enfants pour s'approvisionner, desservant trois hameaux satellites.",
    fullText: `L'accès à l'eau potable a toujours constitué le socle de toute dignité humaine à Nagréogo. Le 38ème forage profond équipé d'un système de pompage immergé solaire et surmonté d'un château d'eau de 20 000 litres a été inauguré dans une atmosphère de profonde liesse populaire.

Désormais, un débit de 5 m³ par heure alimente 6 bornes-fontaines disposées stratégiquement dans les quartiers et auprès de l'école primaire.

Bénéfices constatés :
- Suppression de la corvée d'eau quotidienne pour plus de 600 femmes et fillettes.
- Chute drastique de 85% des maladies hydriques (diarrhées infectieuses, bilharziose) chez les nourrissons.
- Alimentation pérenne de 4 parcelles maraîchères de contre-saison tenues par les coopératives féminines.

L'installation est autonome : un champ de 12 panneaux photovoltaïques à haut rendement alimente la pompe sans carburant ni émissions polluantes.`,
    actionText: 'Voir le reportage',
    stats: '40 000 L/jour',
    statsIcon: 'water',
  },
  {
    id: 'modernisation-embouche-bovine',
    title: 'Modernisation de l’embouche bovine et sélection des races sahéliennes résistantes',
    category: 'elevage video',
    sector: 'elevage',
    tagLabel: 'Élevage',
    tagIcon: 'cruelty_free',
    duration: '03:45',
    views: '6.1k vues',
    badgeSubtitle: 'Savoir-faire Pastoral',
    date: 'Septembre 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB26R7xCT8sbhrHJ4WWKfSAgue2BO3X98MShxKFasxgaBD1phMVkNpYIfc0jyzYAjMubZEGgXoHmg5Z9Jo_4qa1i1TqWT7zZJCyP0wbL3b-mZ3-b-gN3VqHPWuqk64MTktvbcV6rRkiuYkxV1QplLI3qvFOwrfmt0CMf8QgILQ9Ch0lT08gGUZwVa6eeJ2dHYEfVGKZDxQGKiZV1cyLTL1qaq22hxmSX82lN58ebMdWy9ZveYDHiweS',
    alt: "Ferme modèle d'élevage pastoral avec troupeaux de bœufs zébus et moutons sahéliens en excellente santé sous de grands abris ventilés à Nagréogo.",
    summary: "L'alliance entre traditions peules et techniques d'engraissement durables. Découvrez la méthode initiée par la ferme pilote du Cheick pour valoriser la filière viande locale et créer des emplois décents pour les jeunes éleveurs.",
    fullText: `L'embouche bovine à Nagréogo ne relève plus du simple élevage contemplatif : elle est devenue une filière économique d'excellence, protectrice du cheptel sahélien et génératrice de revenus pour les familles pastorales.

Le Cheick Seydou Bikienga a fait le choix délibéré de préserver les races rustiques locales : le zébu Azawak réputé pour sa production laitière et son adaptation au climat aride, ainsi que le zébu Goudali pour sa conformation bouchère.

Les piliers de la méthode Nagréogo :
1. Hangars d'engraissement ventilés naturellement, protégés du soleil de midi.
2. Formulations alimentaires 100% locales à base de fanes d'arachide, son de maïs, tourteau de coton et ensilage vert de niébé.
3. Suivi sanitaire rigoureux (déparasitage semestriel et vaccinations certifiées).

Chaque cycle d'embouche de 90 jours permet un gain moyen de 80 à 100 kg par bête, garantissant une plus-value financière redistribuée au sein de la communauté.`,
    actionText: "Lire l'analyse",
    stats: '+900g/jour de gain',
    statsIcon: 'trending_up',
  },
];

export const HOME_ARTICLES: ArticleItem[] = [
  {
    id: 'patience-de-la-graine',
    title: "La patience de la graine : méditation sur l'effort communautaire",
    date: '12 Octobre 2024',
    readTime: '4 min',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA63VErMeLUme3Nfw3ZGtiOj8mrfJCE4BynWpA51V2u_VzuNqyBk0BCEf6na_JeMFzEnV1Vaz_PyWpSaQhi9YsIgnHni4mmDIKKM3PSdV6e3Jvt7V8mkxRhT_wLnsr7Y-OgGVS-a2DNHY3X2rlKYs2CZUw78ZJWkD8OiG2kwNFaEhhjF2x0xhdi1-mWfd5M_J_Jfb-G1GeFbeZKACGZL9CL33ScRa2ivqtbLc_slNrZsuqW-Jui9Lco',
    alt: "Portrait inspirant et humble d'un doyen en tunique traditionnelle blanche marchant à travers une allée d'acacias et de manguiers ombragés au coucher du soleil à Nagréogo.",
    excerpt: "Pourquoi le retour à la terre fortifie l'esprit et rassemble les générations au village.",
    category: 'Méditation & Spiritualité',
    fullText: `Dans la solitude de la terre aride, la graine enfouie ne se hâte point. Elle attend l'heure fixée par le Créateur, l'arrivée de la goutte d'eau qui brisera son écorce et permettra à la vie de jaillir.

Le Cheick Seydou Bikienga nous rappelle souvent que l'impatience est la maladie des sociétés modernes : vouloir récolter avant d'avoir labouré, prétendre à l'abondance sans avoir consenti à la sueur du front.

À Nagréogo, nous apprenons aux jeunes que la terre est le plus noble des maîtres spirituels. Elle ne ment jamais. Si vous lui donnez de la négligence, elle vous rendra des épines. Mais si vous lui offrez de l'amour, du compost, de l'eau et de la régularité, elle multipliera votre don par cent.

La communauté n'est rien d'autre qu'un champ collectif : chaque habitant est une semence, et c'est dans l'entraide sincère que nous trouvons notre véritable floraison.`,
  },
  {
    id: 'grenier-de-la-solidarite',
    title: 'Le grenier de la solidarité : éradiquer la faim par le partage',
    date: '28 Septembre 2024',
    readTime: '6 min',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXbRHCHQfkHmUKkgrGpvNgfOP6k0q7nHy71LTDkRCcOjAcxX9FpEfcVb1BRGm8ryOMl_SHpN1SO9FmqvrIO9KE5CbWgEc-5M5fB8vhouPu02aHXH0tm3r6ojqIfwNCnyFXvkKrUKo2kA5IouH3SaNxIH-e_mghtHLQsfrTop1usXffVZd6oHVHqdH31vjdbXkQdXP8f0YMnXJyVYLGLiw6VP04quL3IEd8vU_y4UbrpdWd4LXadFgj',
    alt: 'Mains burkinabè tenant des grains de maïs séchés couleur or pur avec en arrière-plan des sacs de céréales stockés pour la sécurité alimentaire communautaire.',
    excerpt: 'Comment Nagréogo a mis sur pied une banque de céréales participative autonome.',
    category: 'Sécurité Alimentaire',
    fullText: `Pendant les décennies passées, la période de soudure — ces mois étouffants entre juin et septembre où les réserves de l'année précédente s'épuisent alors que les nouveaux champs ne sont pas encore prêts — était synonyme de détresse pour les ménages les plus fragiles.

Pour briser ce cycle de vulnérabilité, le Cheick a instauré « Le Grenier de la Fraternité ». Le principe est fondé sur l'éthique islamique et sahélienne de la prévoyance partagée :
1. Chaque producteur consacre 10% de sa récolte au stock commun.
2. Les silos sont construits selon des normes hermétiques traditionnelles renforcées, préservant les grains des charançons sans aucun pesticide toxique.
3. Pendant la soudure, les vivres sont distribués gratuitement aux veuves, aux orphelins et aux aînés, tandis que les autres chefs de famille peuvent emprunter des céréales à taux zéro remboursables à la récolte suivante.

Aujourd'hui, Nagréogo ne connaît plus la disette. Le grenier communautaire stocke plus de 850 tonnes et dessert également les villages voisins en détresse.`,
  },
  {
    id: 'education-morale-apprentissage',
    title: 'Éducation morale & apprentissage agropastoral',
    date: '15 Septembre 2024',
    readTime: '3 min',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5f84jlFwoAbR4vs_ZgGOU2rsPFRD7G1M5hUy9IjY4YOQTgR9egtDV1gfnbKZM0whzwueWI24rDhu-o4XBKFWBgKn73QKOINFBOOdJK4YzPbVeqqSdoUhVrCJXGRR5Fa6OjHze_CjqRs7Hsk5DBSqLn14Jd1mS1nMy-UZ6jHXEtQ7HhHd3foWnEl-xEqwfBvw7DPAy6n5yzSeTHWp-wuRJT3FkD92IPaCJKCxjVVU7DcKqw0ysg_Ba',
    alt: "Jeunes apprenants rassemblés sous l'arbre à palabres devant une école communautaire neuve aux murs en terre crue stabilisée et toiture ventilée au Burkina Faso.",
    excerpt: 'Former les bâtisseurs de demain : le modèle éducatif intégré de notre centre rural.',
    category: 'Jeunesse & Savoir',
    fullText: `L'instruction sans l'ancrage dans la réalité de son terroir produit des esprits déracinés. C'est fort de cette conviction que le Cheick Seydou Bikienga a façonné le cursus des écoles de Nagréogo.

Ici, les enfants reçoivent une double instruction :
- Le matin : acquisition des savoirs fondamentaux (lecture, écriture, calcul, sciences, éthique coranique et valeurs de concorde sociale).
- L'après-midi : apprentissage pratique au champ scolaire et à la ferme pédagogique.

Chaque élève sème, entretient un arbre fruitier qui porte son nom et apprend les gestes de la vie rurale : fabrication du compost, protection des pollinisateurs, soins aux petits ruminants.

« Un jeune qui sait lire le Coran et qui sait également faire pousser une tomate ne sera jamais un fardeau pour son pays ; il en sera le socle », aime à répéter le Cheick.`,
  },
];

export const AGRICULTURE_DATA = {
  header: {
    badge: 'Pôle Agricole',
    title: 'Sillons Verts de Nagréogo',
    description: "Régénération des sols sahéliens par l'alliance du Zaï mécanisé, de l'irrigation goutte-à-goutte solaire et de l'agroforesterie communautaire initiée par le Cheick Bikienga Seydou.",
  },
  stats: [
    { value: '185 ha', label: 'Superficie', sub: 'Terres revivifiées' },
    { value: '12 var.', label: 'Semences', sub: 'Locales & résilientes' },
    { value: '+340', label: 'Emplois', sub: 'Jeunes & femmes' },
  ],
  filters: [
    { id: 'all', label: 'Tous les récits', icon: 'apps' },
    { id: 'techniques', label: 'Zaï & Sols', icon: 'psychology_alt' },
    { id: 'maraichage', label: 'Maraîchage', icon: 'water_drop' },
    { id: 'arbres', label: 'Agroforesterie', icon: 'forest' },
  ],
  videos: [
    {
      id: 'zai-mecanise',
      title: 'Introduction de la méthode Zaï motorisée et restauration des sols arides',
      category: 'techniques',
      duration: '05:30',
      tag: 'Mécanisation & Sols',
      tagIcon: 'psychology_alt',
      progress: 'w-2/5',
      date: 'Campagne Agricole 2024',
      badge: 'Rendement quadruplé',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-3WI0Bdm3V6lWNKFIhtVn2NT0nOetFOxm73hLCmHOcNtKMat9L9QaTa7U4bB8mHasMI7WQt2aGwIM_9m0HOTbJy1nZFddGpjvEbF6Wwb_tFUaQa8H9xoNy7FCaUCBqv4UapeEYRYKcBB_j05sYTHg0NUYkAsxAFzJTJ5n_0gvHOehTaMTZynAZFoujf-bk2Y1xqT3hUF2-jLNqDRgzVvuIV7_c3dN0YO-Z6mD5gtLk3QYKcSn19CX',
      alt: "Vaste étendue agricole verdoyante et ordonnée à Nagréogo au Burkina Faso avec des fosses de Zaï entourées de jeunes pousses de mil et sorgho vert émeraude, sous une chaude lumière dorée de fin d'après-midi africaine avec un sol ocre nourricier et des acacias à l'horizon",
      description: 'En creusant des cuvettes enrichies en compost organique avant les premières pluies, Nagréogo transforme une terre latéritique jadis stérile en champs fertiles de sorgho blanc résistant à la sécheresse.',
      statMetric: '1 800 kg/ha récoltés',
      statIcon: 'verified',
      btnText: 'Lire le compte-rendu',
    },
    {
      id: 'maraichage-solaire',
      title: 'La saison maraîchère : Tomates, oignons et piments sous ombrières solaires',
      category: 'maraichage',
      duration: '04:10',
      tag: 'Irrigation Solaire',
      tagIcon: 'water_drop',
      progress: 'w-1/6',
      date: 'Saison Sèche Active',
      badge: 'Autosuffisance Locale',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTDh_a83pRJ_DemYvhgOVcKnnASw44UeD2i3Y7p786Ir9Vz7_bNtV3W99DI5T-R5DEX4NMdaJZ4xsEAJ-gLRPC071Zs1oyEFNKuNK1ojMj21643b9Z8YH_v1ljTo7hOfWRfw3GWCFGhV7J-XpmtdpTZjKPc1QNDghLNhGicpbhqWC0Uc_7gpF56oWdJqBZREcAEiPwT3bsC3iI8KeguY7v3OnAwdI6c5RpEYrTUkS4nlkIki7fUAbN',
      alt: "Champs maraîchers modernes au Sahel avec parcelles de tomates rouges bien mûres et rangées de piments et d'oignons protégées par des filets d'ombrage solaires, paysans souriants en plein travail d'arrosage goutte-à-goutte automatisé",
      description: 'Témoignages de 40 jeunes fermiers formés aux pépinières de contre-saison. La micro-aspersion alimentée par panneaux photovoltaïques préserve 70% de la nappe phréatique tout en approvisionnant les marchés de la province.',
      statMetric: 'Production hebdomadaire continue',
      statIcon: 'storefront',
      btnText: 'Guide maraîcher',
    },
    {
      id: 'agroforesterie-arbres',
      title: 'Régénération naturelle assistée : planter 10 000 arbres fruitiers et acacias',
      category: 'arbres',
      duration: '07:15',
      tag: 'Reboisement Utile',
      tagIcon: 'forest',
      progress: 'w-3/4',
      date: 'Ceinture Verte',
      badge: 'Grand Reportage',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_kqq3nn14-uV0x_S6SOJ4AcrJsaq-DBJ1kTMGWrda02y75_qqfMFPln80e5yer85sBTl_dCDdCUZVfjO13EK3UgLY6Wj6n_9KCcaRPKHK0vijkmHKwCxCP2bAnQBCfzPz2GjdBf4tRWEa0dpuSseTQtyRn2SwY_HuGDLBZjt8HzqJDsM1Dqh33U4AFh4G16_5mLjdogn97k-UcH0slp3zB_yLMEy7vN5EStnxf7U5RS8DQsRQ8CWC',
      alt: "Jeunes plants de manguiers d'agrumes et d'acacia albida alignés au cœur d'une terre sahélienne reboisée, des villageois arrosant avec bienveillance sous la lumière tamisée de l'aube",
      description: "Un pas décisif contre l'avancée du désert. Le Cheick Seydou Bikienga détaille la sélection des essences fertilisantes (*Faidherbia albida*) qui injectent naturellement l'azote dans le sol pour nourrir les céréales associées.",
      statMetric: '10 420 arbres protégés',
      statIcon: 'yard',
      btnText: 'Voir la carte',
    },
  ],
  quote: "« Soigner la terre de nos ancêtres avec patience et méthode, c'est semer la paix et nourrir la dignité de nos enfants. »",
  author: '— CHEICK BIKIENGA SEYDOU, NAGRÉOGO',
};

export const ELEVAGE_DATA = {
  header: {
    badge: 'Pôle Pastoral & Élevage',
    title: 'Modernisation & Préservation Pastorale à Nagréogo',
    description: "Sous la vision du Cheick Bikienga Seydou, notre domaine pastoral réconcilie les savoirs sahéliens ancestraux et les technologies vétérinaires durables. Nous œuvrons pour l'autonomie en protéines animales et l'amélioration génétique ciblée des races locales emblématiques : zébus Azawak et Goudali, taurins Peuls et moutons Djallonké résistants.",
    quote: "« Nourrir dignement la terre et soigner le troupeau, c'est préserver la paix et l'abondance des générations à venir. »",
    author: 'CHEICK BIKIENGA SEYDOU • NAGRÉOGO',
  },
  filters: [
    { id: 'all', label: 'Tout voir' },
    { id: 'bovins', label: 'Bovins Azawak & Goudali' },
    { id: 'ovins', label: 'Ovins Djallonké' },
    { id: 'laiterie', label: 'Laiterie & Fourrage' },
  ],
  stats: [
    { value: '98.4%', label: 'Couverture vaccinale', icon: 'verified', bg: 'bg-[#c1ecd4] text-[#002114]' },
    { value: '850 L', label: 'Lait frais / jour', icon: 'water_drop', bg: 'bg-[#ffca98] text-[#7a532a]' },
    { value: '120 T', label: 'Foin & ensilage', icon: 'grass', bg: 'bg-[#e2eae4] text-[#012d1d]' },
  ],
  videos: [
    {
      id: 'elevage-video-1',
      title: "Techniques d'embouche bovine intensive & foin de saison sèche",
      duration: '05:40',
      badge: 'Embouche Bovine',
      badgeIcon: 'psychiatry',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYx_dxhI-vjGaTPNvOSkf9KLHv82M-v9LLSktFgyOxf6fsy9zp_CstvhcVsf7ASg3Ffspl4Jjr8HElVGt2RLdmOI2mt0UH-ntz-FA-0k2KY0ZPZq5Q5ZhSx8zkPEE3adT3JD1eAJ6Cfopb0LdOBJiWHXGHUI39wLI_2dqM-2WL81-iG4TXfefzMnQQPR7TFRKlKG-mmlrzw7br--KZUDpzSecw1Z0Sj04_2zzJKtm6UOkQ34SUMUyB',
      alt: 'Zébus Azawak et Goudali dans un enclos ombragé et bien entretenu à Nagréogo Burkina Faso.',
      description: "Pour maintenir un gain de poids moyen de 900g/jour en période d'aridité sans dépendre d'aliments importés coûteux, le Cheick Bikienga préconise une synergie agropastorale directe. Les résidus de maïs, fanes d'arachide et tourteaux de coton locaux sont densifiés et enrichis à l'ensilage de niébé.",
      date: 'Publié le 18 Mars 2025',
      actionText: "Lire l'étude complète",
    },
    {
      id: 'elevage-video-2',
      title: 'Santé du cheptel : Campagne vaccinale annuelle offerte aux éleveurs',
      duration: '04:25',
      badge: 'Santé Vétérinaire',
      badgeIcon: 'medical_services',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnasvmsZXeM1T0_GE2vyYwrZRhZPIgug-ynmtpjl76hnnRiG5bk-7abply3wY2Gggxtd9bEgdOkt2QvoLtBfU6xqtJT3uhUdm_7FIs3CSW8vthwN4BHAeyG1QqaHOA6gvLsv-5F2SyOf3eRR2qL3VcgmcLB_JWDjngD3jpcr4W_MhYFVSJzn9We7CsUpsV4MjI6mjv1jmXnO8aqsC_pT6V4I-Ok32R7elkaH3mq2ybjgrPU7NB8nxE',
      alt: 'Équipe de vétérinaires et éleveurs soignant des moutons et bœufs à Nagréogo.',
      description:
        "Dr. Ouedraogo, vétérinaire en chef du projet, détaille dans cet épisode le protocole de déparasitage systématique et la prévention contre la péripneumonie contagieuse bovine. Une action humanitaire et sanitaire financée intégralement pour sécuriser l'épargne vivante des familles rurales.",
      date: 'Publié le 04 Février 2025',
      actionText: "Voir l'interview",
      statHighlight: {
        title: 'Mortalité juvénile réduite de 70%',
        subtitle: 'Sur plus de 3 200 têtes traitées gratuitement en 2024',
      },
    },
    {
      id: 'elevage-video-3',
      title: 'La mini-laiterie : De la traite hygiénique au conditionnement frais',
      duration: '06:50',
      badge: 'Mini-Laiterie',
      badgeIcon: 'local_drink',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYrboXwJSSfHf-QPQmkFlva272-luLzqiywcIvNFa2mgLf7MTy95lduztgZqYQcv-axAcKsLZ9pX0_HWCH6YGIFzUKSAdJ_qewBQWDe-cy31y5xAanqZ50MdCQ2LZ6258PIXDOeOwY2hVNJXnC-flZ9MU4LBI_IwYIgkxKC6fJj2d-MczAR0RSJc-5eyJsJFZZk6BHGE2NezC9jHg2vgfe73_uIVOrqaJADZMcTfP-l6yX76qmnVwt',
      alt: 'Intérieur lumineux de la mini-laiterie coopérative artisanale à Nagréogo avec bidons en inox.',
      description:
        "Valoriser le lait sur place pour créer de la valeur économique locale et garantir une nutrition saine aux écoliers de Nagréogo. Découvrez la chaîne de froid solaire et les standards d'hygiène rigoureux appliqués dès l'aube.",
      date: 'Publié le 12 Janvier 2025',
      actionText: 'Lire le guide laitier',
      steps: [
        {
          num: '1',
          title: 'Contrôle de conformité :',
          desc: "Test d'acidité et d'hygiène lactique dès la réception des bidons inox.",
        },
        {
          num: '2',
          title: 'Pasteurisation douce :',
          desc: "Chauffage contrôlé pour conserver les nutriments vivants et l'onctuosité.",
        },
        {
          num: '3',
          title: 'Conditionnement hermétique :',
          desc: 'Embouteillage en verre réutilisable distribué à Nagréogo et ses environs.',
        },
      ],
    },
  ],
  rules: [
    {
      ruleNum: 'Règle #1',
      title: 'Abri thermique & ventilation naturelle',
      desc: "Ne laissez jamais les animaux exposés entre 11h et 16h lors des pics à plus de 40°C. Aménagez des hangars à double toit en chaume local et orientez les ouvertures face aux vents d'harmattan pour favoriser un courant d'air rafraîchissant sans poussière.",
      icon: 'wb_sunny',
      bgIcon: 'bg-[#ffca98] text-[#7a532a]',
    },
    {
      ruleNum: 'Règle #2',
      title: 'Abreuvement à l’eau tempérée ombragée',
      desc: "Une eau chaude (>30°C) en plein soleil coupe l'appétit de l'animal et provoque des indigestions. Isolez les canalisations d'eau des forages et distribuez de l'eau fraîche enrichie d'une pincée de sel gemme pour compenser la déshydratation minérale.",
      icon: 'water',
      bgIcon: 'bg-[#c1ecd4] text-[#002114]',
    },
    {
      ruleNum: 'Règle #3',
      title: 'Alimentation nocturne & aux aurores',
      desc: 'La digestion génère une forte chaleur métabolique interne. Distribuez 65% de la ration de foin et de concentrés entre 18h et 22h, et très tôt au lever du jour, permettant ainsi à la panse de digérer sereinement pendant les heures fraîches.',
      icon: 'nightlight_round',
      bgIcon: 'bg-[#e2eae4] text-[#012d1d]',
    },
  ],
};

export const HUMANITAIRE_DATA = {
  header: {
    badge: 'Pôle Humanitaire & Solidarité',
    title: 'Au Cœur de la Fraternité Sahélienne',
    description: 'Des puits de vie aux greniers solidaires, chaque action menée à Nagréogo est un acte de foi envers la dignité humaine et le relèvement communautaire.',
    quote: "« Donner de l'eau, nourrir un foyer affamé ou instruire un orphelin n'est point une faveur : c'est notre dette sacrée envers cette terre et ceux qui y souffrent. »",
    author: 'Cheick Bikienga Seydou',
  },
  stats: [
    { value: '38', label: 'Forages & Puits', icon: 'water_drop', color: 'text-primary' },
    { value: '1 420', label: 'Kits Scolaires', icon: 'school', color: 'text-secondary' },
    { value: '850 t', label: 'Vivres Soudure', icon: 'inventory_2', color: 'text-primary' },
  ],
  wellProgress: {
    title: 'Progression du Puits N°39 (Nagréogo Nord)',
    percent: 82,
    note: 'Foration terminée • Installation du groupe solaire et cuve en cours',
  },
  chronicles: [
    {
      id: 'forage-38',
      title: "Inauguration du 38ème forage d'eau potable avec borne-fontaine",
      badge: 'Eau Potable',
      badgeIcon: 'water_full',
      duration: '07:20',
      location: 'Inauguration Officielle • Village de Nagréogo',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY2Rkr8IDFY5Eozk4ynjBsEq8EKyuTwy4sH9FJQV1sA_7WneyC16AiGcbVKwH3baf57gV-4XI6gYCUOTd0iOJe6PeV06kwNre_pLARtiJe99Q1aYgLNDaHxqzvVbgw0Md_bQx8h-XrT6sEfjHoZOZEJLIxto3sKvCm6KgJydts-RGVJ9XHUHl0nbPbnzJhed-DUPzYCF1RkzzOi02q3PwG3fCrKvvLwXQn6eTetQV_7OQmalv7_J5D',
      alt: "Photographie documentaire émouvante à Nagréogo montrant des femmes et mères rassemblées autour d'une borne-fontaine moderne.",
      description: "Pour plus de 450 femmes et mères de famille, cette borne solaire met fin à plusieurs kilomètres de marche quotidienne sous le soleil ardent. L'eau coule claire, abondante et gratuite, transformant les routines familiales et l'hygiène infantile.",
      statusText: '100% financé & opérationnel',
      expandedNarrative: "« Auparavant, nous partions avant l'aube pour espérer remplir un canari dans un bas-fond boueux », témoigne Aïssata Ouédraogo, doyenne du quartier Ouest. Grâce au forage solaire raccordé au château d'eau de 10 m³, la pression assure un service ininterrompu.",
      impactBox: "Impact direct : 1 200 bénéficiaires quotidiens, zéro corvée nocturne, et 4 jardins potagers maraîchers irrigués autour du point d'eau.",
    },
    {
      id: 'vivres-soudure',
      title: 'Distribution de vivres et céréales solidaires aux ménages vulnérables',
      badge: 'Soudure & Nutrition',
      badgeIcon: 'grain',
      duration: '04:50',
      location: 'Sécurité Alimentaire • Période Critique',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC66u0O0FO7cPINry87CY3-LM39b31YByJghlFStp_aTvx4M7cjXKILDOwRMRwPpTd-GkpZCEd79rvciJJfA5ndmK3YeJTXYlSEqDSsFORb8l-vtgOBWYzHgdwocYyOkHxgUHnQ-e4xvldfY2RR8nJQ4hCEZGUPsoxjr7fMCuWIELYeaOShS8OH1pRBbw4U5vMmCym-uBvWH-9AsChaX5aSoAXLamtNs5lFQteJVX_cCGu23tq6gtqk',
      alt: 'Distribution solidaire de sacs de mil, maïs et sorgho organisée sous de grands acacias à Nagréogo au Burkina Faso.',
      description:
        "Lors des mois de soudure entre deux récoltes, le spectre de la faim menace les plus isolés. Le Cheick et son réseau de donateurs mobilisent les silos d'urgence pour alimenter plus de 320 familles.",
      statusText: '320 foyers secourus',
      expandedNarrative: "Chaque colis contient 50 kg de céréales locales (sorgho rouge et petit mil), de l'huile fortifiée et du sucre. Les doyens ont béni cette prévoyance qui permet aux travailleurs de la terre de garder leurs forces avant les grands labours d'hivernage.",
      impactBox: "Bilan : 16 tonnes de grains distribuées en 48 heures, soutien nutritionnel garanti pour plus de 1 600 enfants et personnes âgées.",
    },
    {
      id: 'rentree-scolaire',
      title: 'Rentrée solidaire : Fournitures scolaires et bourses pour 200 orphelins',
      badge: 'Éducation',
      badgeIcon: 'backpack',
      duration: '05:10',
      location: 'Avenir & Savoir • Rentrée 2024-2025',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCafM793rWPt_6MNwtVRnEEdtmguCsRd93jTHsAgTFTn1X8JVL2kDAmh8yjof6qyjZ_Rd1D2xgmrNn5igAGmIBd4qZcAS1jVKUa1KJx-U9fUDPtHisLK0A6fRaivdDB9B9dqKSKRd6OKvPCUnBadgQOJwFznqBeEIcICuecgWh2-kc5iiREYjoUJAfYOOdrY63R4SQvH2y_lU95hcEmWHGfPDJMcVST7H0o0LuclGRkPu4W0oYUAR07',
      alt: 'Rentrée des classes solidaire à Nagréogo au Burkina Faso avec des jeunes garçons et filles fiers de leurs cartables neufs.',
      description: "Aucun enfant de Nagréogo ne doit être privé d'instruction par manque de cahiers ou d'uniforme. Un engagement renouvelé pour faire de l'école le socle du développement sahélien.",
      statusText: '200 élèves scolarisés',
      expandedNarrative: "En plus des kits complets (sacs, fournitures, stylos, livres de lecture), les frais de scolarité et de cantine sont intégralement pris en charge pour l'année scolaire entière, offrant sérénité aux mères veuves et tuteurs.",
      impactBox: "100% de taux de scolarisation maintenu parmi les orphelins accompagnés, avec un taux de réussite de 94% à l'examen du CEP.",
    },
  ],
};

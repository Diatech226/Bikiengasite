# Audit des contenus éditoriaux du site public

## Périmètre inspecté

L'audit couvre `App.tsx`, les quatre écrans publics, le header, la navigation mobile, les modales de don, profil, recherche, favoris, article, guide et reportage, ainsi que le contexte de contenu et les données d'initialisation du backend.

## Contenus éditoriaux administrables

Les blocs MongoDB restent regroupés dans `SiteContent` : identité, navigation, pied de page, coordonnées, profil, guide, dons, recherche et pages Accueil, Agriculture, Élevage et Humanitaire. Ils couvrent les titres, accroches, descriptions, citations, statistiques, filtres, libellés de formulaire, messages éditoriaux, CTA et états vides. La bannière finale de l'accueil (accroche, description et deux CTA) et les messages de la section Articles ont été achevés dans cette migration.

Les reportages, chroniques et projets sont gérés séparément par `MediaItem`, sans multiplier les collections. Leur titre, description, récit, image, texte alternatif, badge, date, métrique, CTA, section, type, ordre, visibilité, catégorie, lieu et encarts sont administrables.

## Contenu volontairement technique

Les valeurs suivantes restent dans le code ou sont affichées en lecture seule dans le CMS :

- identifiants de navigation et catégories de don, car la logique React/API les utilise pour router et valider les demandes ;
- routes, endpoints, noms de composants, noms des propriétés et clés MongoDB ;
- icônes Material Symbols et classes CSS/Tailwind, car elles définissent le rendu et ne sont pas du contenu éditorial ;
- rôles, authentification, secrets et variables serveur ;
- messages purement fonctionnels d'accessibilité ou d'erreur réseau générique.

## Source de vérité et conservation

MongoDB est la source de vérité en exploitation. `content.defaults.ts` ne sert qu'à créer les blocs et médias absents. Le seed utilise exclusivement des insertions `$setOnInsert` pour ces données et ne remplace donc pas les modifications réalisées par un administrateur.

## Reliquats identifiés

Quelques micro-libellés d'interface purement fonctionnels restent codés dans les composants (fermeture, partage, enregistrement, réglage de lecture, chargement technique et administration). Ils ne décrivent ni l'activité ni les projets et sont volontairement traités comme du vocabulaire produit, pas comme du contenu éditorial. Les contenus des articles restent administrés par le module Articles existant, et les dons/demandes de contact restent dans leurs modules métier dédiés.
## Audit de stabilisation du CMS (octobre 2026)

Le nouvel audit des écrans publics confirme que les textes métier structurants sont fournis par les blocs `site.*` et `*.page`, tandis que les reportages, chroniques et projets proviennent des médias du CMS. Les écrans Agriculture, Élevage et Humanitaire dérivent maintenant leurs listes de médias sans modifier les objets fournis par `ContentContext`.

Les chaînes qui restent volontairement dans les composants sont des libellés fonctionnels d’interface (par exemple « Fermer », « Partager », « Charger », « Réessayer » et « Administration »), des messages de validation/erreur, ou des attributs d’accessibilité. Elles ne constituent pas du contenu éditorial métier. Les données initiales de démonstration restent dans `backend/src/database/content.defaults.ts` et sont insérées uniquement à l’initialisation ; elles deviennent ensuite modifiables dans le CMS sans être écrasées par le seed.

La gestion des médias dispose désormais d’une liste distincte, de filtres, d’un formulaire dédié et d’un champ image isolé. Ce dernier constitue le point de remplacement prévu pour un futur upload ou une médiathèque, sans introduire de stockage de fichiers à ce stade.

## Audit final du modèle éditorial (octobre 2026)

Chaque propriété des douze blocs a été comparée au rendu public, aux modales et à l’éditeur. Le service de contenu filtre désormais les anciennes propriétés lors de la lecture et avant toute sauvegarde : une base créée avec une version antérieure ne réinjecte donc pas de champs orphelins dans le formulaire.

| Bloc | Champs conservés et utilisés | Champs supprimés | Motif |
| --- | --- | --- | --- |
| `site.brand` | nom, sous-titre, logo et texte alternatif | aucun | Tous sont visibles dans l’en-tête ou le pied de page. |
| `site.navigation` | liens, libellés de recherche, soutien et profil | aucun | Les identifiants restent techniques et protégés ; les libellés restent éditables. |
| `site.footer` | présentation, titres, soutien, boutons, mentions et signature | aucun | Tous participent au pied de page desktop volontairement concis. |
| `site.contact` | lieu, e-mail, téléphone et WhatsApp | aucun | Le lieu, l’e-mail et le téléphone sont visibles ; WhatsApp reste une coordonnée métier réutilisable. |
| `site.profile`, `site.guide`, `site.donation`, `site.search` | tous les textes, images, alternatives, options et états visibles | aucun | Chaque propriété alimente encore sa modale ou son formulaire. |
| `home.page` | hero, présentation, quatre indicateurs, titres de reportages/articles, états de chargement et CTA final | bouton hero secondaire, filtres, anciens libellés « tout voir », « à la une » et lecture, bouton d’administration de l’état vide, CTA secondaire final | Ces contrôles n’étaient plus rendus ou répétaient les listes et le CTA principal. |
| `agriculture.page` | hero, trois chiffres, titre des reportages et guide | filtres, citation et auteur | Les filtres et la citation avaient disparu du rendu simplifié. |
| `elevage.page` | hero, trois chiffres, titres de sections, conseils et CTA | ration graphique, filtres, citation/auteur, styles et numéros décoratifs des conseils, bouton de contact dupliqué | Le frontend présente désormais les conseils comme une liste éditoriale et utilise le contact transversal. |
| `humanitaire.page` | hero, trois chiffres, titres des reportages, chemin don/contact | progression isolée, citation/auteur, anciens états de lecture/partage et ancien formulaire de contact | Les récits portent les résultats ; le don persiste via l’API et le contact utilise les coordonnées centrales sans doublon de formulaire. |

Les médias conservent leur titre, description, corps, image, alternative, badge, date, métrique, CTA, section, type, ordre et visibilité. Les métadonnées existantes restent conservées car elles alimentent la recherche, la durée et les détails des reportages ou permettent leur évolution sans perte éditoriale.

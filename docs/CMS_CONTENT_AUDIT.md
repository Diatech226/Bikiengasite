# Audit des contenus éditoriaux du site public

## Périmètre inspecté

L'audit couvre `App.tsx`, les quatre écrans publics, le header, la navigation mobile, les modales de don, profil, recherche, favoris, article, guide et reportage, ainsi que le contexte de contenu et les données d'initialisation du backend.

## Contenus éditoriaux administrables

Les blocs MongoDB restent regroupés dans `SiteContent` : identité, navigation, pied de page, coordonnées, profil, guide, dons, recherche et pages Accueil, Agriculture, Élevage et Humanitaire. Ils couvrent les titres, accroches, descriptions, citations, statistiques, filtres, libellés de formulaire, messages éditoriaux, CTA et états vides. La bannière finale de l'accueil (accroche, description et deux CTA) et les messages de la section Articles ont été achevés dans cette migration.

Les reportages, chroniques et projets sont gérés séparément par `MediaItem`, sans multiplier les collections. Leur titre, description, récit, image, texte alternatif, badge, date, métrique, CTA, section, type, ordre, visibilité, catégorie, lieu et encarts sont administrables.

## Contenu volontairement technique

Les valeurs suivantes restent dans le code ou sont affichées en lecture seule dans le CMS :

- identifiants de navigation, filtres, catégories de don et options de contact, car la logique React/API les utilise pour router et filtrer ;
- routes, endpoints, noms de composants, noms des propriétés et clés MongoDB ;
- icônes Material Symbols et classes CSS/Tailwind, car elles définissent le rendu et ne sont pas du contenu éditorial ;
- rôles, authentification, secrets et variables serveur ;
- messages purement fonctionnels d'accessibilité ou d'erreur réseau générique.

## Source de vérité et conservation

MongoDB est la source de vérité en exploitation. `content.defaults.ts` ne sert qu'à créer les blocs et médias absents. Le seed utilise exclusivement des insertions `$setOnInsert` pour ces données et ne remplace donc pas les modifications réalisées par un administrateur.

## Reliquats identifiés

Quelques micro-libellés d'interface purement fonctionnels restent codés dans les composants (fermeture, partage, enregistrement, réglage de lecture, chargement technique et administration). Ils ne décrivent ni l'activité ni les projets et sont volontairement traités comme du vocabulaire produit, pas comme du contenu éditorial. Les contenus des articles restent administrés par le module Articles existant, et les dons/demandes de contact restent dans leurs modules métier dédiés.

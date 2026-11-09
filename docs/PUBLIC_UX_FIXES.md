# Corrections du parcours public

## Comportement

- L’introduction et le bouton vers les projets précèdent les reportages.
- Les rubriques utilisent `/`, `/agriculture`, `/elevage`, `/humanitaire` et `/projets`.
- Les lecteurs utilisent `/reportages/:slug` et `/articles/:slug`. Un article partagé est chargé par son slug, indépendamment des 100 premiers articles de la liste.
- Les liens de navigation fonctionnent avec l’historique et le rechargement. Les chemins inconnus affichent une page introuvable.
- `/admin` ouvre le contrôle de session et la connexion existants. Les API d’administration restent protégées par les guards JWT du backend. Le lien est accessible depuis le pied de page, désormais également visible sur mobile.
- Les échecs des API de contenu et d’articles remontent jusqu’à l’interface. Le secours local reste disponible, avec un avertissement, une possibilité de réessayer et une erreur dans la console. Les annulations de requêtes ne sont pas traitées comme des pannes.
- Le soutien annonce une intention sans débit, avant et après transmission. Les cinq champs ont des labels associés ; les montants sont un groupe de boutons avec légende et état de sélection.
- La fenêtre de soutien et les lecteurs gèrent Échap, le focus initial, le confinement du focus, l’isolation de l’arrière-plan et le retour au déclencheur lorsqu’il est encore présent.
- Les reportages affichent leur texte et un temps de lecture estimé à partir du contenu, au lieu d’une durée vidéo.
- Les fichiers de verrouillage frontend et backend permettent les commandes `npm ci` déjà utilisées par la CI et les Dockerfiles.

## Validation réalisée

- Frontend : TypeScript, compilation Vite, quatre tests de routes et de temps de lecture.
- Backend : TypeScript, compilation Nest, dix suites / 34 tests réussis.
- `git diff --check` réussi.
- Exécution locale sur Node 24 / npm 11 ; l’installation a nécessité de désactiver la vérification stricte des moteurs uniquement pour cette commande. Les versions Node 22 / npm 10 du projet et de la CI sont conservées.
- Pas de validation visuelle ou clavier en navigateur : Chromium était absent et son téléchargement a échoué dans l’environnement. Les contrôles suivants restent à réaliser sur une prévisualisation.

## Contrôles de prévisualisation

1. Sur mobile, vérifier l’introduction avant les reportages et l’accès au pied de page.
2. Ouvrir Agriculture, recharger, puis utiliser Précédent et Suivant.
3. Ouvrir et partager un reportage, puis ouvrir son URL dans un nouvel onglet ; répéter avec un article.
4. Couper l’API : vérifier le secours et l’avertissement. Rétablir l’API et utiliser Réessayer.
5. Ouvrir le soutien depuis un projet : vérifier les labels, Tab et Maj+Tab, Échap et le retour du focus.
6. Sur un environnement de test, envoyer une intention : vérifier la confirmation sans paiement et l’enregistrement dans l’administration.
7. Ouvrir `/admin` sans session : vérifier l’écran de connexion, puis tester une session valide.

Le serveur de production doit servir `index.html` pour les chemins de l’application. Le fichier `nginx.conf` du dépôt contient déjà cette règle. Une autre plateforme d’hébergement doit fournir l’équivalent.

# Bikiengasite

Application React/Vite servie séparément d'une API NestJS, avec MongoDB/Mongoose. En production, le navigateur communique en HTTPS avec l'API, qui seule accède à MongoDB Atlas.

## Environnements et démarrage local

- **Développement** : MongoDB local via Compose, Swagger actif, URLs localhost.
- **Test** : variables isolées et base dédiée ; ne jamais pointer les tests vers la production.
- **Production** : HTTPS, Atlas, secrets fournis par la plateforme, Swagger désactivé par défaut.

```bash
cp .env.example .env
cp backend/.env.example backend/.env
docker compose up -d mongo
npm ci && npm run dev
# autre terminal
cd backend && npm ci && npm run seed && npm run dev
```

Frontend : `VITE_API_URL` uniquement (par défaut local dans `.env.example`). Toute variable `VITE_*` est publique dans le bundle : n'y placez jamais URI MongoDB, secret JWT ou mot de passe. Backend : voir `backend/.env.example`. Générez **trois valeurs distinctes** pour `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` et `VIEW_HASH_SECRET` avec trois exécutions de `openssl rand -hex 32`.

Le seed est volontaire : `cd backend && npm run seed`. Il crée l'admin seulement s'il n'existe pas et ne réinitialise donc jamais silencieusement son mot de passe. Pour changer celui-ci, utilisez une procédure administrative explicite (ou supprimez volontairement le compte avant un nouveau seed).

## Builds, tests et Docker

```bash
npm ci && npm run lint && npm run build
cd backend && npm ci && npm run lint && npm run build && npm test
docker build --build-arg VITE_API_URL=https://api.example.com/api/v1 -t bikienga-frontend .
docker build -t bikienga-backend ./backend
```

`VITE_API_URL` est injectée **à la compilation**, pas au démarrage du conteneur. Nginx assure le fallback SPA, ne cache pas `index.html` et cache durablement les assets hashés. Les source maps de production sont désactivées. Le Compose racine reste volontairement limité à MongoDB de développement (`docker compose up -d mongo`).

## MongoDB Atlas et indexes

1. Créer un cluster Atlas et un utilisateur de base avec droits minimaux.
2. Dans Network Access, autoriser uniquement les adresses du backend (éviter `0.0.0.0/0` si possible).
3. Copier l'URI `mongodb+srv://...`, y sélectionner la base `bikiengasite`, puis définir `MONGODB_URI` sur la plateforme.
4. Aucune collection ne doit être créée manuellement : Mongoose créera `users`, `categories`, `articles`, `articleviews`, `donations` et `contactrequests`.

`autoIndex: true` est assumé afin de garantir au déploiement les contraintes uniques et indexes nécessaires (emails, noms/slugs, publication/catégorie/vedette, vues uniques, statuts/dates et types). Pour une très grande base, migrer ultérieurement vers une commande contrôlée de synchronisation avant de le désactiver. La sélection serveur expire après 10 secondes et un échec initial empêche le démarrage. Le health check `GET /api/v1/health` renvoie 200 si la base répond et 503 sinon. Les hooks SIGTERM/SIGINT sont activés.

## Déploiement de référence

### Frontend (Vercel/Netlify/Pages)

- framework : Vite ; build : `npm ci && npm run build` ; sortie : `dist` ;
- variable de build : `VITE_API_URL=https://api.example.com/api/v1`.

### Backend (Render/Railway/Fly)

- répertoire racine : `backend` ; build : `npm ci && npm run build` ; démarrage : `npm run start:prod` ; health : `/api/v1/health` ;
- variables : `NODE_ENV=production`, `PORT`, `MONGODB_URI`, `FRONTEND_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `VIEW_HASH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FIRST_NAME`, `ADMIN_LAST_NAME`, `ENABLE_SWAGGER=false`.

`FRONTEND_URL` accepte plusieurs origines HTTPS séparées par des virgules ; elles sont nettoyées et dédupliquées, sans wildcard. En production, `trust proxy=1` suppose **exactement un reverse proxy de confiance** entre Internet et Node ; le port Node ne doit pas être exposé directement. Adapter explicitement cette hypothèse si l'infrastructure comporte plusieurs proxies (notamment Cloudflare + ingress), faute de quoi l'IP du compteur de vues serait incorrecte. Helmet reste actif côté API.

Swagger n'est servi sur `/api/docs` que si `ENABLE_SWAGGER=true` (à réserver au développement ou à un accès maîtrisé). `FRONTEND_URL` et `VITE_API_URL` doivent utiliser HTTPS en production.

Le refresh token reste temporairement dans `sessionStorage`, tandis que l'access token reste en mémoire. C'est cohérent et évite une migration cookie/CSRF partielle, mais un script injecté pourrait lire le refresh token : une future migration complète vers cookie HttpOnly/Secure/SameSite avec modèle CSRF testé est recommandée.

## Exploitation et sécurité

- Utiliser les sauvegardes automatiques Atlas si le plan le permet et prévoir des exports réguliers selon les besoins.
- Restreindre Atlas, imposer HTTPS, protéger les comptes admin et définir une politique de rétention pour les données personnelles des dons et contacts ; ne jamais les journaliser.
- Les routes admin sont protégées par JWT ; leur visibilité dans le bundle n'accorde aucun accès aux données.
- Les images distantes actuelles (notamment `lh3.googleusercontent.com`) restent externes. À terme, Cloudinary, S3 ou MinIO offriraient davantage de contrôle.

Smoke test après déploiement : vérifier `GET /health`, `GET /articles`, `POST /auth/login`, puis avec le bearer token `GET /auth/me` et `GET /admin/dashboard`, enfin `POST /donations` et `POST /contact-requests` avec des données factices. Ne stocker aucun mot de passe dans un script.

## Checklist production

- [ ] MongoDB Atlas et utilisateur DB créés ; Network Access limité
- [ ] `MONGODB_URI` configuré
- [ ] secrets JWT distincts et `VIEW_HASH_SECRET` générés
- [ ] `FRONTEND_URL` et `VITE_API_URL` HTTPS configurés
- [ ] `ADMIN_EMAIL` et `ADMIN_PASSWORD` configurés ; seed lancé une fois
- [ ] HTTPS actif ; Swagger désactivé ou contrôlé
- [ ] health check opérationnel
- [ ] builds frontend/backend et tests validés
- [ ] sauvegardes et rétention définies

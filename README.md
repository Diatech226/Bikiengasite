# Bikiengasite

Application React/Vite servie séparément d'une API NestJS, avec MongoDB/Mongoose. En production, le navigateur communique en HTTPS avec l'API, qui seule accède à MongoDB Atlas.

## Installation locale

### Prérequis

- **Node.js 22.14.0 LTS exactement** ; `nvm use` lit la version fixée dans `.nvmrc` ;
- **npm 10.9.2** (déclaré par `packageManager`) ;
- Docker/Compose pour MongoDB local, ou une instance MongoDB compatible accessible par URI.

Les versions majeures sont volontairement bornées et les dépendances directes sont fixées précisément. N'utilisez ni `--force` ni `--legacy-peer-deps`. Les fichiers `.npmrc` limitent le nombre de tentatives et le délai réseau (120 secondes par requête) afin qu'une registry, un proxy ou un DNS indisponible échoue clairement au lieu de donner l'impression que l'installation est bloquée.

### Frontend

```bash
nvm install                 # une seule fois ; installe la version de .nvmrc
nvm use
cp .env.example .env
npm ci
npm run lint
npm run dev                 # http://localhost:3000
```

En développement, le frontend utilise `http://localhost:5000/api/v1` si aucun fichier `.env` n'existe : la commande `npm run dev` fonctionne donc sans configuration supplémentaire. Pour un build de production, `VITE_API_URL` est obligatoire et Vite affiche une erreur explicite si elle manque. La copie de `.env.example` permet de personnaliser cette URL. Toute variable `VITE_*` est publique dans le bundle : n'y placez jamais une URI MongoDB, un secret JWT ou un mot de passe.

### Backend et base locale

```bash
cp backend/.env.example backend/.env
docker compose up -d mongo
cd backend
npm ci
npm run lint
npm run seed                # explicite et idempotent
npm run dev                 # http://localhost:5000
```

Variables backend obligatoires : `MONGODB_URI`, `FRONTEND_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` et `VIEW_HASH_SECRET`. `PORT`, `NODE_ENV`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN` et `ENABLE_SWAGGER` ont des valeurs par défaut. Les variables `ADMIN_*` ne sont nécessaires que pour `npm run seed`. Générez **trois valeurs distinctes** pour les secrets avec trois exécutions de `openssl rand -hex 32`.

Le seed crée l'administrateur seulement s'il n'existe pas et ne réinitialise jamais silencieusement son mot de passe. Pour le changer, utilisez une procédure administrative explicite (ou supprimez volontairement le compte avant un nouveau seed).

Le backend refuse volontairement de démarrer sans `backend/.env` valide. La validation NestJS nomme les variables absentes dès le démarrage, au lieu d'utiliser silencieusement des secrets ou une base par défaut. Sous **PowerShell**, préparez les fichiers avec :

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
```

Ensuite, un développeur Windows peut exécuter `npm ci; npm run dev` à la racine, puis `cd backend; npm ci; npm run dev` dans un second terminal. MongoDB doit être accessible à l'URI indiquée ; `docker compose up -d mongo` fournit l'instance locale documentée.

### Nettoyer une installation corrompue

Les commandes suivantes sont portables entre Windows, Linux et macOS (elles utilisent Node plutôt que `rm -rf`) :

```bash
node -e "require('fs').rmSync('node_modules',{recursive:true,force:true})"
npm cache verify
npm ci
cd backend
node -e "require('fs').rmSync('node_modules',{recursive:true,force:true})"
npm cache verify
npm ci
```

Conservez les deux `package-lock.json` versionnés. Ne les supprimez pas et ne remplacez pas `npm ci` par `npm install` dans l'intégration continue. Si une installation échoue sur un téléchargement, vérifiez d'abord `npm config get registry`, le proxy et l'accès à `https://registry.npmjs.org/` ; le délai configuré est de 120 secondes par requête, avec seulement deux nouvelles tentatives.

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

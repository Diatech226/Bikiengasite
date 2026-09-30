# Bikienga API

Backend NestJS utilisant MongoDB/Mongoose, JWT rotatif et une documentation OpenAPI.

## Démarrage local

```bash
cp .env.example .env
docker compose up -d mongo
npm install
npm run seed
npm run dev
```

API : `http://localhost:5000/api/v1` — Swagger : `http://localhost:5000/api/docs`.

Le seed exige `MONGODB_URI`, `ADMIN_EMAIL` et `ADMIN_PASSWORD`. Il crée l'administrateur uniquement s'il n'existe pas (son mot de passe n'est jamais remplacé silencieusement) et utilise des upserts pour rester idempotent. Pour MongoDB Atlas, remplacez simplement `MONGODB_URI` par l'URI `mongodb+srv://...` fournie par Atlas, sans la committer. Consultez le README racine pour le guide complet de production.

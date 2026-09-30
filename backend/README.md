# Bikienga API

Backend NestJS indépendant, PostgreSQL/Prisma, JWT rotatif et documentation OpenAPI.

## Démarrage

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

API : `http://localhost:5000/api/v1` — Swagger : `http://localhost:5000/api/docs`.
Le seed exige `ADMIN_EMAIL` et `ADMIN_PASSWORD`; il est idempotent (`upsert`). Les intentions de don sont enregistrées avec le statut `PENDING` et ne constituent pas un paiement.

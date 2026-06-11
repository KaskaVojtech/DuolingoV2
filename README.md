# DELTALINGO Admin Panel

Admin panel pro jazykovou vzdělávací aplikaci.

## Stack

- **Backend:** NestJS + TypeORM + PostgreSQL + Redis (port 3001)
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + SCSS (port 3000)

## Spuštění

```bash
cp .env.example .env
# Upravte .env hodnoty

docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Porty

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379

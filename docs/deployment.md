# Deployment Guide

## Recommended Production Topology

- Frontend/API: Vercel or containerized Next.js on Fly.io/AWS.
- PostgreSQL: Neon, Supabase, RDS, or Railway PostgreSQL with PITR enabled.
- Redis: Upstash, Railway, ElastiCache, or Fly Redis.
- Workers: Railway/Fly.io/AWS ECS running BullMQ consumers.
- Storage: Cloudflare R2 with private buckets and signed URLs.
- Email: Resend.
- Logs: Pino JSON shipped to Datadog, Better Stack, or OpenTelemetry collector.

## Environment Setup

1. Copy `.env.example` to `.env.local`.
2. Configure database, Redis, auth, payment, email, storage, and platform OAuth secrets.
3. Run `npm run prisma:generate`.
4. Run migrations against staging before production.
5. Configure provider webhooks to `/api/webhooks/stripe`, `/api/webhooks/razorpay`, and `/api/webhooks/paypal`.

## Docker

Use `docker-compose.yml` for local PostgreSQL and Redis.

```bash
docker compose up -d
npm run prisma:migrate
npm run dev
```

## CI/CD

GitHub Actions runs install, Prisma generation, typecheck, lint, tests, and build. Production deployment should require successful CI, reviewed migrations, and environment variable validation.

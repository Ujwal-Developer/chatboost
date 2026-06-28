# ChatBoost

ChatBoost is a production-oriented foundation for a global creator monetization SaaS platform: paid highlighted livestream messages, realtime OBS overlays, creator dashboards, viewer flows, admin operations, modular payments, and future streaming-platform adapters.

## Phase 1 Scope

- Next.js App Router product surface with landing, creator payment page, overlay, creator dashboard, viewer dashboard, and admin dashboard routes.
- Prisma schema covering users, creator/viewer profiles, settings, payments, paid messages, overlays, themes, goals, supporters, memberships, analytics, notifications, sessions, audit logs, API keys, refunds, and payouts.
- Modular domain libraries for RBAC, platform fees, payment providers, streaming providers, realtime events, AI moderation, and API validation.
- Production scaffolding: Docker, CI, environment template, architecture docs, API docs, launch checklist, monitoring, and test strategy.

## Run Locally

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example`, then run Prisma setup when PostgreSQL is available:

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Important Directories

- `src/app`: routes and API handlers.
- `src/components`: reusable UI components.
- `src/lib`: domain, integrations, auth, security, realtime, payments, and validation.
- `prisma`: database schema.
- `docs`: architecture, roadmap, deployment, monitoring, testing, and launch checklist.

## Product Principles

Creators should keep approximately 90% of every payment before gateway fees. Viewers should be able to pay as guests with the fewest possible steps. Every successful payment emits a single canonical realtime event that fans out to overlays, dashboards, analytics, leaderboards, notifications, and future platform integrations.

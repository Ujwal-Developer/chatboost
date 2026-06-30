# ChatBoost

ChatBoost is a production-oriented foundation for a global creator monetization SaaS platform: paid highlighted livestream messages, realtime OBS overlays, creator dashboards, creator payment links, admin operations, modular payments, and future streaming-platform adapters.

## Phase 1 Scope

- Next.js App Router product surface with landing, creator payment page, overlay, creator dashboard, and admin dashboard routes.
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

## Worldwide Channel Verification

ChatBoost's primary channel-verification path is platform-neutral and does not depend on Google Cloud billing:

1. Creator submits their official channel/profile URL.
2. ChatBoost generates a unique proof code such as `CHATBOOST-HANDLE`.
3. Creator places that code in a public bio, about section, pinned post, channel panel, or linked website.
4. Creator pastes the exact public proof URL into the verification form.
5. Admin opens the channel and proof URL, confirms the code is visible, and approves or rejects the creator.

This works for YouTube, Twitch, Kick, Instagram, TikTok, creator websites, and other public creator profiles. Provider OAuth can still be added later as a faster verification shortcut.

## Current Launch State

The creator login, proof-code verification UI, dashboard, shareable creator payment page, and overlay preview are ready for product testing. Real-money launch still needs persistent database-backed creator reviews, protected admin access, production payment provider checkout/webhooks, and payout/KYC handling before taking payments from the public.

## Important Directories

- `src/app`: routes and API handlers.
- `src/components`: reusable UI components.
- `src/lib`: domain, integrations, auth, security, realtime, payments, and validation.
- `prisma`: database schema.
- `docs`: architecture, roadmap, deployment, monitoring, testing, and launch checklist.

## Product Principles

Creators should keep approximately 90% of every payment before gateway fees. Viewers should be able to pay as guests with the fewest possible steps. Every successful payment emits a single canonical realtime event that fans out to overlays, dashboards, analytics, leaderboards, notifications, and future platform integrations.

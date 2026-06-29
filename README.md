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

## Real Creator Authentication

Demo verification uses browser storage. To test with a real YouTube creator account, configure OAuth in Google Cloud and add these environment variables in Vercel:

```bash
NEXT_PUBLIC_APP_URL=https://chatboost.rynovax.com
AUTH_SECRET=use-a-long-random-secret-at-least-24-chars
YOUTUBE_CLIENT_ID=your-google-oauth-client-id
YOUTUBE_CLIENT_SECRET=your-google-oauth-client-secret
```

Add this authorized redirect URI to the Google OAuth client:

```text
https://chatboost.rynovax.com/api/auth/youtube/callback
```

Then open `/creator/verification` and click **Connect YouTube**. ChatBoost will send the creator through Google OAuth, read the authenticated YouTube channel, and mark channel ownership as verified. Identity and payout checks still need production KYC/payout providers before real money launch.

## Important Directories

- `src/app`: routes and API handlers.
- `src/components`: reusable UI components.
- `src/lib`: domain, integrations, auth, security, realtime, payments, and validation.
- `prisma`: database schema.
- `docs`: architecture, roadmap, deployment, monitoring, testing, and launch checklist.

## Product Principles

Creators should keep approximately 90% of every payment before gateway fees. Viewers should be able to pay as guests with the fewest possible steps. Every successful payment emits a single canonical realtime event that fans out to overlays, dashboards, analytics, leaderboards, notifications, and future platform integrations.

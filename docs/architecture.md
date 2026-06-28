# ChatBoost System Architecture

## Product Boundary

ChatBoost monetizes livestream attention through paid highlighted messages. The first production milestone is YouTube plus browser-source OBS overlays. The architecture keeps streaming platforms, payment providers, moderation, and realtime delivery behind adapters so future channels can be added without rewriting payment or dashboard code.

## Logical Services

- Web app: Next.js App Router for landing, creator pages, dashboards, admin, and API routes.
- API/domain layer: typed services for authentication, RBAC, payments, webhooks, paid messages, moderation, analytics, overlays, and payouts.
- PostgreSQL: canonical transactional store via Prisma.
- Redis: rate limits, Socket.IO adapter, idempotency locks, queues, and hot dashboard aggregates.
- BullMQ workers: webhook processing, AI moderation, AI voice, email receipts, analytics rollups, refunds, and payouts.
- Socket.IO gateway: creator rooms for overlay, dashboard, activity, leaderboard, and goal updates.
- Object storage: Cloudflare R2 for avatars, banners, audio, GIF/video alerts, exports, and generated voice files.

## Payment Flow

1. Viewer opens `chatboost.com/@creator`.
2. Country and currency are inferred from request metadata.
3. API returns eligible payment providers for country and currency.
4. Viewer submits display name, message, amount, provider, and optional viewer identity.
5. Server validates input, rate-limits, creates an idempotency key, calculates platform/gateway/tax fields, and creates a provider payment intent.
6. Provider webhook is verified with provider-specific signature logic.
7. A single database transaction marks payment successful, creates paid message, updates supporter totals, updates balances, and writes audit logs.
8. Realtime fanout updates OBS overlay, creator dashboard, analytics, activity feed, goal bars, and leaderboards.
9. Guest viewers are offered account conversion after success.

## Realtime Rooms

Each creator has a private room: `creator:{creatorId}`. Overlay URLs use `browserSourceToken`, not raw creator IDs, in production. Dashboards join authenticated rooms; overlays join token-scoped display rooms. Events are immutable JSON contracts under `src/lib/realtime/events.ts`.

## Security Model

- RBAC gates creator, viewer, admin, payout, refund, and overlay permissions.
- Payment webhooks require signature validation and idempotency keys.
- Secrets live only in environment variables.
- Audit logs capture admin actions, security events, payout changes, refunds, and account changes.
- Rate limits protect public payment and webhook endpoints.
- PCI scope is minimized by hosted payment fields or provider checkout sessions.

## Scaling Model

- Web app scales horizontally behind CDN and edge cache.
- Socket.IO uses Redis adapter for fanout across nodes.
- Payment/webhook workers are queue-backed and idempotent.
- Analytics are written transactionally for correctness and rolled up asynchronously for dashboards.
- Partition high-volume tables later by `createdAt` and `creatorId` when traffic requires it.

# Feature Roadmap

## Phase 1 - Foundation

- Next.js product surface, public creator pages, OBS overlay preview, creator dashboard, viewer dashboard, admin panel.
- Prisma schema for the complete core domain.
- Payment adapter interface with Stripe, Razorpay, PayPal, and UPI stubs.
- Streaming adapter interface with YouTube first and future platform placeholders.
- RBAC, fee engine, validation, API contracts, Docker, CI, env docs, launch checklist.

## Phase 2 - Authentication and Onboarding

- Auth.js or Clerk integration.
- Email verification, password reset, Google login.
- Creator onboarding wizard: profile, public URL, YouTube connection, payout setup, overlay customization.
- Viewer account conversion after guest payments.

## Phase 3 - Payments and Webhooks

- Stripe Payment Intents and Stripe Connect.
- Razorpay orders, UPI, and Indian payment method routing.
- PayPal checkout.
- Webhook signature verification, idempotency locks, refunds, chargebacks, and payout ledger.

## Phase 4 - Realtime and Overlay

- Socket.IO server with Redis adapter.
- Tokenized OBS browser-source URLs.
- Alert animations, sounds, GIF/video alerts, goal bars, top supporter banner, recent activity, and AI voice playback.

## Phase 5 - AI and Safety

- AI moderation pipeline for spam, scams, hate speech, toxicity, and smart highlighting.
- AI auto thank-you and suggested replies.
- Creator-controlled moderation policies and review queue.

## Phase 6 - Scale and Operations

- BullMQ workers, queue dashboards, structured Pino logging, OpenTelemetry traces.
- Admin fraud tooling, payout operations, user management, refund workflows, and platform settings.
- Load testing, disaster recovery, data retention, and compliance workflows.

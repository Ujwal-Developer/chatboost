# Production Launch Checklist

## Current Status

- Product demo and creator payment-link flow are ready for review.
- Real-money public launch is blocked until production payment checkout/webhooks, persistent database storage, admin access control, and payout/KYC workflows are connected.

## Product

- Creator onboarding flow is complete.
- Public creator URLs resolve and are protected from username squatting.
- Guest checkout is under four primary actions.
- Post-payment account conversion is live.
- Overlay browser-source URL uses a revocable token.

## Payments

- Stripe, Razorpay, PayPal, and UPI production credentials are configured.
- Webhook signatures are verified.
- Idempotency and duplicate payment detection are enforced.
- Refunds and chargebacks update balances correctly.
- Fee, tax, and net earnings fields reconcile against provider reports.

## Security

- RBAC is covered by tests.
- Rate limits are enabled on public and webhook endpoints.
- Secrets are stored in environment variables or managed secret stores.
- Audit logs exist for admin and payout actions.
- Security headers and secure cookies are enabled.

## Operations

- CI passes.
- Database backups and PITR are enabled.
- Logs, metrics, traces, and alerts are configured.
- Incident runbook exists.
- Support refund and payout workflows are documented.

## Scale

- Redis-backed Socket.IO fanout is deployed.
- Queue workers autoscale.
- CDN is configured.
- Load tests hit launch SLOs.
- Database indexes are validated with realistic query plans.

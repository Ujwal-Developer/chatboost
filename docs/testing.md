# Testing Strategy

## Unit Tests

- Fee engine.
- RBAC permission matrix.
- Payment provider routing by country.
- Currency detection.
- Moderation decisions.
- Validation schemas.

## Integration Tests

- Payment intent creation.
- Webhook verification and idempotency.
- Paid message creation transaction.
- Overlay token access.
- CSV export.
- Refund and chargeback state transitions.

## End-to-End Tests

- Guest viewer payment flow.
- Guest-to-account conversion.
- Creator onboarding.
- Creator overlay customization.
- Dashboard realtime updates.
- Admin payout approval and fraud review.

## Load Tests

- Payment API burst traffic.
- Webhook throughput.
- Socket.IO fanout to creator rooms.
- Overlay cold start.
- Dashboard aggregate refresh.

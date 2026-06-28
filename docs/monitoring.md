# Monitoring and Logging

## Logs

Use Pino structured logs with request IDs, user IDs where available, creator IDs, provider names, idempotency keys, and event names. Never log raw secrets, access tokens, full card data, or webhook signing secrets.

## Metrics

- Payment intent creation latency.
- Webhook verification failures.
- Payment success, failure, refund, and chargeback rates.
- Overlay event latency p50/p95/p99.
- Socket.IO connected clients by creator.
- Queue depth and worker failure rates.
- Creator balance reconciliation mismatches.
- Admin action volume.

## Alerts

- Webhook failure spike.
- Provider outage or degraded payment success.
- Redis unavailable.
- Database connection saturation.
- Queue backlog above SLO.
- Overlay delivery latency above target.
- Payout failure spike.

## Auditability

Admin actions, payout updates, refunds, account suspension, API key creation, and security-sensitive profile changes should write immutable audit logs.

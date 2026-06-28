# API Documentation

## Payments

`GET /api/payments?country=IN`

Returns country-appropriate payment providers and currency.

`POST /api/payments`

Creates a payment intent for a paid message.

```json
{
  "creatorId": "creator_123",
  "displayName": "Maya",
  "message": "This stream deserves a boost.",
  "amount": 1000,
  "currency": "USD",
  "countryCode": "US",
  "provider": "stripe"
}
```

Response includes provider intent, status, idempotency key, fee breakdown, and moderation decision.

## Webhooks

`POST /api/webhooks/:provider`

Verifies provider webhook payloads and returns the fanout targets. Production implementation must persist inside an idempotent transaction before emitting realtime events.

## Analytics Export

`GET /api/analytics/export`

Returns CSV for creator analytics exports.

## Realtime Events

`POST /api/realtime/events`

Accepts canonical realtime event payloads. In production this is replaced by a Socket.IO gateway and queue-backed publisher.

## RBAC

RBAC permissions are defined in `src/lib/security/rbac.ts`. Admin inherits all creator and viewer permissions plus `admin:*` and `payout:manage`.

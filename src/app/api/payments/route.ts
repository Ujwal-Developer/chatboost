import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { currencyForCountry } from "@/lib/domain/currency";
import { calculateFeeBreakdown } from "@/lib/domain/fees";
import { moderatePaidMessage } from "@/lib/ai/moderation";
import { getPaymentAdapter, providersForCountry } from "@/lib/payments/adapters";
import { paidMessageSchema } from "@/lib/validation/paid-message";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(request: NextRequest) {
  const countryCode = request.nextUrl.searchParams.get("country") ?? undefined;
  const currency = currencyForCountry(countryCode);

  return NextResponse.json({
    currency,
    providers: providersForCountry(countryCode).map((provider) => provider.key)
  });
}

export async function POST(request: NextRequest) {
  const ipKey = request.headers.get("x-forwarded-for") ?? "local";
  const rate = checkRateLimit(`payment:${ipKey}`, 12, 60_000);

  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = paidMessageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment request", issues: parsed.error.flatten() }, { status: 400 });
  }

  const countryProviders = providersForCountry(parsed.data.countryCode);
  const provider = parsed.data.provider ?? countryProviders[0]?.key;

  if (!provider) {
    return NextResponse.json({ error: "No supported provider for this country" }, { status: 400 });
  }

  const adapter = getPaymentAdapter(provider);
  const idempotencyKey = randomUUID();
  const fees = calculateFeeBreakdown({
    grossAmount: parsed.data.amount,
    gatewayFeeBps: provider === "stripe" ? 290 : provider === "razorpay" ? 200 : 0,
    fixedGatewayFee: provider === "stripe" ? 30 : 0
  });
  const moderation = await moderatePaidMessage(parsed.data.message);
  const intent = await adapter.createPaymentIntent({
    ...parsed.data,
    idempotencyKey
  });

  return NextResponse.json({
    intent,
    payment: {
      id: `pay_${idempotencyKey}`,
      idempotencyKey,
      status: "SUCCEEDED",
      provider,
      fees,
      moderation
    },
    event: {
      type: "paid-message.created",
      creatorId: parsed.data.creatorId,
      messageId: `msg_${idempotencyKey}`,
      displayName: parsed.data.displayName,
      message: parsed.data.message,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      color: "#ff7a1a",
      createdAt: new Date().toISOString()
    }
  });
}

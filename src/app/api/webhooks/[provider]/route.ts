import { NextRequest, NextResponse } from "next/server";
import { getPaymentAdapter } from "@/lib/payments/adapters";

export async function POST(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const adapter = getPaymentAdapter(provider);
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? request.headers.get("x-razorpay-signature") ?? undefined;
  const result = await adapter.verifyWebhook(payload, signature);

  if (!result.valid) {
    return NextResponse.json({ error: "Invalid webhook signature or payload" }, { status: 400 });
  }

  return NextResponse.json({
    received: true,
    provider,
    eventType: result.eventType,
    paymentId: result.paymentId,
    fanout: ["overlay", "dashboard", "analytics", "leaderboard", "activity-feed"]
  });
}

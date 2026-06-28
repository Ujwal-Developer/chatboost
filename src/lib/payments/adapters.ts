import type { CreatePaymentIntentInput, PaymentAdapter, PaymentIntentResult, WebhookVerificationResult } from "./types";

function demoIntent(provider: PaymentAdapter["key"], input: CreatePaymentIntentInput): PaymentIntentResult {
  return {
    provider,
    providerPaymentId: `${provider}_${input.idempotencyKey}`,
    clientSecret: `demo_secret_${input.idempotencyKey}`,
    checkoutUrl: `/checkout/${provider}?intent=${input.idempotencyKey}`,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  };
}

function demoWebhook(payload: string): WebhookVerificationResult {
  try {
    const parsed = JSON.parse(payload) as { type?: string; paymentId?: string };
    return { valid: true, eventType: parsed.type, paymentId: parsed.paymentId, raw: parsed };
  } catch {
    return { valid: false };
  }
}

export const stripeAdapter: PaymentAdapter = {
  key: "stripe",
  supportsCountry: (countryCode) => countryCode !== "IN",
  createPaymentIntent: async (input) => demoIntent("stripe", input),
  verifyWebhook: async (payload) => demoWebhook(payload)
};

export const razorpayAdapter: PaymentAdapter = {
  key: "razorpay",
  supportsCountry: (countryCode) => countryCode === "IN",
  createPaymentIntent: async (input) => demoIntent("razorpay", input),
  verifyWebhook: async (payload) => demoWebhook(payload)
};

export const paypalAdapter: PaymentAdapter = {
  key: "paypal",
  supportsCountry: () => true,
  createPaymentIntent: async (input) => demoIntent("paypal", input),
  verifyWebhook: async (payload) => demoWebhook(payload)
};

export const upiAdapter: PaymentAdapter = {
  key: "upi",
  supportsCountry: (countryCode) => countryCode === "IN",
  createPaymentIntent: async (input) => demoIntent("upi", input),
  verifyWebhook: async (payload) => demoWebhook(payload)
};

export const paymentAdapters = [razorpayAdapter, upiAdapter, stripeAdapter, paypalAdapter];

export function providersForCountry(countryCode?: string) {
  return paymentAdapters.filter((adapter) => adapter.supportsCountry(countryCode));
}

export function getPaymentAdapter(provider: string) {
  const adapter = paymentAdapters.find((item) => item.key === provider);
  if (!adapter) throw new Error(`Unsupported payment provider: ${provider}`);
  return adapter;
}

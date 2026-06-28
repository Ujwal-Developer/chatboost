import type { SupportedCurrency } from "@/lib/domain/currency";

export type PaymentProviderKey = "stripe" | "razorpay" | "paypal" | "upi";

export type CreatePaymentIntentInput = {
  creatorId: string;
  viewerId?: string;
  displayName: string;
  message: string;
  amount: number;
  currency: SupportedCurrency;
  countryCode?: string;
  idempotencyKey: string;
};

export type PaymentIntentResult = {
  provider: PaymentProviderKey;
  providerPaymentId: string;
  clientSecret?: string;
  checkoutUrl?: string;
  expiresAt?: string;
};

export type WebhookVerificationResult = {
  valid: boolean;
  eventType?: string;
  paymentId?: string;
  raw?: unknown;
};

export interface PaymentAdapter {
  key: PaymentProviderKey;
  supportsCountry(countryCode?: string): boolean;
  createPaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult>;
  verifyWebhook(payload: string, signature?: string): Promise<WebhookVerificationResult>;
}

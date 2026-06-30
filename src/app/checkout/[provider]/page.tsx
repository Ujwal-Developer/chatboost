import { notFound } from "next/navigation";
import { ProviderCheckoutClient } from "@/components/checkout/provider-checkout-client";

const allowedProviders = new Set(["stripe", "razorpay", "paypal"]);

export default async function CheckoutPage({
  params,
  searchParams
}: {
  params: Promise<{ provider: string }>;
  searchParams: Promise<{ intent?: string }>;
}) {
  const { provider } = await params;
  const { intent } = await searchParams;

  if (!allowedProviders.has(provider)) {
    notFound();
  }

  return <ProviderCheckoutClient provider={provider} intentId={intent ?? null} />;
}

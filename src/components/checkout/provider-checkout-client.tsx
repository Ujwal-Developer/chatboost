"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, CreditCard, Landmark, Loader2, Smartphone } from "lucide-react";
import { BrandLink } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { addLiveBoost, boostFromPaymentResponse } from "@/lib/client/live-boosts";

type PendingCheckout = {
  intentId: string;
  mode: "sandbox" | "live";
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  displayName: string;
  message: string;
  amount: number;
  currency: string;
  provider: string;
  paymentId: string;
  moderationStatus?: string;
};

const providerLabels: Record<string, string> = {
  stripe: "Card / Apple Pay",
  razorpay: "Razorpay / UPI",
  paypal: "PayPal"
};

function readPendingCheckout(intentId: string | null) {
  if (!intentId || typeof window === "undefined") return null;
  try {
    const stored = window.sessionStorage.getItem(`chatboost.checkout.${intentId}`);
    return stored ? (JSON.parse(stored) as PendingCheckout) : null;
  } catch {
    return null;
  }
}

export function ProviderCheckoutClient({ provider, intentId }: { provider: string; intentId: string | null }) {
  const [pending, setPending] = useState<PendingCheckout | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "complete">("idle");
  const label = providerLabels[provider] ?? "Payment provider";
  const isRazorpay = provider === "razorpay";
  const isPaypal = provider === "paypal";
  const formattedAmount = useMemo(() => {
    if (!pending) return "";
    return new Intl.NumberFormat("en", { style: "currency", currency: pending.currency, maximumFractionDigits: 0 }).format(pending.amount / 100);
  }, [pending]);

  useEffect(() => {
    setPending(readPendingCheckout(intentId));
  }, [intentId]);

  function completeCheckout() {
    if (!pending) return;
    setStatus("submitting");

    const boost = boostFromPaymentResponse({
      creatorId: pending.creatorId,
      displayName: pending.displayName,
      message: pending.message,
      amount: pending.amount,
      currency: pending.currency,
      provider: pending.provider,
      paymentId: pending.paymentId,
      moderationStatus: pending.moderationStatus
    });

    addLiveBoost(boost);
    if (intentId) window.sessionStorage.removeItem(`chatboost.checkout.${intentId}`);
    window.setTimeout(() => setStatus("complete"), 650);
  }

  return (
    <main className="min-h-screen px-5 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <BrandLink className="inline-flex text-white/75 hover:text-white" />
        <section className="surface mt-8 rounded-lg p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-medium text-ember">{label}</p>
              <h1 className="mt-2 text-3xl font-semibold">Complete your tip</h1>
              <p className="mt-3 text-sm leading-6 text-white/58">
                {pending ? `Pay ${formattedAmount} to support ${pending.creatorName}.` : "This checkout session could not be found. Please start again from the creator payment page."}
              </p>
            </div>
            {pending?.mode === "sandbox" ? <span className="rounded-lg border border-ember/25 bg-ember/10 px-3 py-2 text-sm text-ember">Sandbox checkout</span> : null}
          </div>

          {pending ? (
            <>
              <div className="mt-6 rounded-lg border border-line bg-black/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white/48">Creator</span>
                  <strong>{pending.creatorName}</strong>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-sm text-white/48">Supporter</span>
                  <strong>{pending.displayName}</strong>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/64">{pending.message}</p>
              </div>

              <div className="mt-5 grid gap-4">
                {isRazorpay ? (
                  <>
                    <label className="grid gap-2 text-sm text-white/68">
                      UPI ID or mobile number
                      <div className="flex overflow-hidden rounded-lg border border-line bg-black/35 focus-within:focus-ring">
                        <span className="grid h-12 place-items-center border-r border-line px-3 text-ember">
                          <Smartphone size={17} />
                        </span>
                        <input required className="h-12 min-w-0 flex-1 bg-transparent px-3 text-white outline-none" placeholder="name@bank or +91 mobile" />
                      </div>
                    </label>
                    <label className="grid gap-2 text-sm text-white/68">
                      Bank / wallet
                      <select className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring">
                        <option>UPI</option>
                        <option>Net banking</option>
                        <option>Razorpay wallet</option>
                      </select>
                    </label>
                  </>
                ) : isPaypal ? (
                  <label className="grid gap-2 text-sm text-white/68">
                    PayPal email
                    <div className="flex overflow-hidden rounded-lg border border-line bg-black/35 focus-within:focus-ring">
                      <span className="grid h-12 place-items-center border-r border-line px-3 text-ember">
                        <Landmark size={17} />
                      </span>
                      <input required type="email" className="h-12 min-w-0 flex-1 bg-transparent px-3 text-white outline-none" placeholder="you@example.com" />
                    </div>
                  </label>
                ) : (
                  <>
                    <label className="grid gap-2 text-sm text-white/68">
                      Card number
                      <div className="flex overflow-hidden rounded-lg border border-line bg-black/35 focus-within:focus-ring">
                        <span className="grid h-12 place-items-center border-r border-line px-3 text-ember">
                          <CreditCard size={17} />
                        </span>
                        <input required inputMode="numeric" className="h-12 min-w-0 flex-1 bg-transparent px-3 text-white outline-none" placeholder="4242 4242 4242 4242" />
                      </div>
                    </label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2 text-sm text-white/68">
                        Expiry
                        <input required className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" placeholder="MM / YY" />
                      </label>
                      <label className="grid gap-2 text-sm text-white/68">
                        CVC
                        <input required inputMode="numeric" className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" placeholder="123" />
                      </label>
                    </div>
                  </>
                )}
              </div>

              {status === "complete" ? (
                <div className="mt-5 rounded-lg border border-mint/30 bg-mint/10 p-4 text-sm text-mint">
                  <div className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 shrink-0" size={17} />
                    <p>{pending.mode === "live" ? "Payment complete." : "Sandbox checkout complete. The tip is now visible in dashboard and overlay preview."}</p>
                  </div>
                  <Link className="mt-3 inline-flex text-white hover:text-white/70" href={pending.creatorHandle}>
                    Back to creator page
                  </Link>
                </div>
              ) : null}

              <Button className="mt-5 w-full" type="button" disabled={status === "submitting" || status === "complete"} onClick={completeCheckout}>
                {status === "submitting" ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                {status === "submitting" ? "Confirming checkout" : `Pay ${formattedAmount}`}
              </Button>
              <p className="mt-3 text-center text-xs text-white/42">
                Live launch should replace this sandbox screen with the provider-hosted checkout URL from Stripe, Razorpay, or PayPal.
              </p>
            </>
          ) : (
            <Link className="mt-6 inline-flex h-11 items-center rounded-lg bg-white px-4 text-sm font-semibold text-black hover:bg-white/90" href="/">
              Go home
            </Link>
          )}
        </section>
      </div>
    </main>
  );
}

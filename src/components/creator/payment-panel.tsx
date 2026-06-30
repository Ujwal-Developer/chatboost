"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, CreditCard, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addLiveBoost, boostFromPaymentResponse, type LiveBoost } from "@/lib/client/live-boosts";
import { formatMoney } from "@/lib/utils";

const amounts = [500, 1000, 2500, 5000];
const providers = [
  { value: "stripe", label: "Card / Apple Pay" },
  { value: "razorpay", label: "Razorpay / UPI" },
  { value: "paypal", label: "PayPal" }
];

type PaymentPanelProps = {
  creatorId?: string;
  creatorName?: string;
  creatorHandle?: string;
};

export function PaymentPanel({ creatorId = "demo-creator", creatorName = "Nova Plays", creatorHandle = "@nova" }: PaymentPanelProps) {
  const [amount, setAmount] = useState(1000);
  const [provider, setProvider] = useState("stripe");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastBoost, setLastBoost] = useState<LiveBoost | null>(null);
  const currency = provider === "razorpay" ? "INR" : "USD";
  const amountMajor = amount / 100;

  function updateAmountFromMajor(value: string) {
    const next = Math.round(Number(value) * 100);
    if (Number.isFinite(next)) {
      setAmount(Math.min(Math.max(next, 100), 500_000));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const displayName = String(form.get("displayName") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          creatorId,
          displayName,
          message,
          amount,
          currency,
          countryCode: provider === "razorpay" ? "IN" : "US",
          provider
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Payment failed");
      }

      const boost = boostFromPaymentResponse({
        creatorId,
        displayName,
        message,
        amount,
        currency,
        provider,
        paymentId: payload.payment.id,
        moderationStatus: payload.payment.moderation.status
      });

      addLiveBoost(boost);
      setLastBoost(boost);
      setStatus("success");
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Payment failed");
    }
  }

  return (
    <form className="surface rounded-lg p-5" onSubmit={handleSubmit} data-testid="payment-form">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ember">Tip {creatorHandle}</p>
          <h2 className="mt-1 text-2xl font-semibold">Pay or tip {creatorName}</h2>
        </div>
        <Sparkles className="text-ember" size={24} />
      </div>

      <label className="mt-6 block text-sm text-white/68" htmlFor="displayName">
        Display name
      </label>
      <input id="displayName" name="displayName" required minLength={2} maxLength={40} className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" defaultValue="Guest Supporter" />

      <label className="mt-4 block text-sm text-white/68" htmlFor="message">
        Message
      </label>
      <textarea id="message" name="message" required maxLength={240} className="mt-2 min-h-28 w-full resize-none rounded-lg border border-line bg-black/35 p-3 text-white outline-none focus-visible:focus-ring" defaultValue="Keep creating. This tip is for you!" />

      <label className="mt-4 block text-sm text-white/68" htmlFor="amount">
        Amount
      </label>
      <div className="mt-2 flex overflow-hidden rounded-lg border border-line bg-black/35 focus-within:focus-ring">
        <span className="grid h-12 place-items-center border-r border-line px-3 text-white/42">{currency}</span>
        <input
          id="amount"
          name="amount"
          type="number"
          min="1"
          max="5000"
          step="1"
          value={amountMajor}
          onChange={(event) => updateAmountFromMajor(event.target.value)}
          className="h-12 min-w-0 flex-1 bg-transparent px-3 text-white outline-none"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {amounts.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setAmount(item)}
            className={`h-11 rounded-lg border text-sm font-semibold transition ${
              amount === item ? "border-ember bg-ember text-black" : "border-line bg-white/6 text-white hover:bg-white/10"
            }`}
          >
            {formatMoney(item, currency)}
          </button>
        ))}
      </div>

      <label className="mt-4 block text-sm text-white/68" htmlFor="provider">
        Payment method
      </label>
      <select
        id="provider"
        className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring"
        value={provider}
        onChange={(event) => setProvider(event.target.value)}
      >
        {providers.map((item) => (
          <option key={item.value} value={item.value} className="bg-black">
            {item.label}
          </option>
        ))}
      </select>

      {status === "success" && lastBoost ? (
        <div className="mt-5 rounded-lg border border-mint/30 bg-mint/10 p-4 text-sm text-mint" data-testid="payment-success">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 shrink-0" size={17} />
            <p>{lastBoost.amountLabel} tip sent. The creator can see it in their dashboard and overlay.</p>
          </div>
        </div>
      ) : null}

      {status === "error" && error ? (
        <div className="mt-5 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200" data-testid="payment-error">
          {error}
        </div>
      ) : null}

      <Button className="mt-5 w-full" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
        {status === "submitting" ? "Processing payment" : "Pay / tip now"}
      </Button>
      <p className="mt-3 text-center text-xs text-white/45">
        Viewers do not need an account. This shared creator link sends the payment and message straight to the creator.
      </p>
    </form>
  );
}

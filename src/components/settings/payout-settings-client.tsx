"use client";

import { FormEvent, useEffect, useState } from "react";
import { BadgeCheck, Banknote, CircleAlert, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

type PayoutProfile = {
  country: string;
  currency: string;
  method: string;
  accountHolder: string;
  bankName: string;
  accountLast4: string;
  ifscOrRouting: string;
  upiId: string;
  paypalEmail: string;
  taxName: string;
};

const storageKey = "chatboost.payoutProfile";

const defaultProfile: PayoutProfile = {
  country: "IN",
  currency: "INR",
  method: "bank",
  accountHolder: "",
  bankName: "",
  accountLast4: "",
  ifscOrRouting: "",
  upiId: "",
  paypalEmail: "",
  taxName: ""
};

function readPayoutProfile() {
  if (typeof window === "undefined") return defaultProfile;
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? { ...defaultProfile, ...(JSON.parse(stored) as Partial<PayoutProfile>) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function PayoutSettingsClient() {
  const [profile, setProfile] = useState<PayoutProfile>(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(readPayoutProfile());
  }, []);

  function update(field: keyof PayoutProfile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(storageKey, JSON.stringify(profile));
    setSaved(true);
  }

  const methodCopy =
    profile.method === "upi"
      ? "UPI ID is used for Indian creator payouts after admin review."
      : profile.method === "paypal"
        ? "PayPal email is used for countries where card-network payouts are not connected yet."
        : "Bank details are used for creator payouts after identity, tax, and admin review.";

  return (
    <form className="surface rounded-lg p-5" onSubmit={save}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-ember">
            <Banknote size={17} />
            Creator payout setup
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Where should ChatBoost send your earnings?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
            Add a receiving method before requesting payout approval. Do not enter full card numbers here; live payouts should use bank, UPI, PayPal, or Stripe Connect details.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-black/25 px-3 py-2 text-sm text-white/62">
          <CircleAlert size={16} className="text-ember" />
          Review required
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm text-white/68">
          Country
          <select value={profile.country} onChange={(event) => update("country", event.target.value)} className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring">
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="EU">Europe</option>
            <option value="AE">United Arab Emirates</option>
            <option value="AU">Australia</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-white/68">
          Payout currency
          <select value={profile.currency} onChange={(event) => update("currency", event.target.value)} className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring">
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="AED">AED</option>
            <option value="AUD">AUD</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-white/68">
          Receiving method
          <select value={profile.method} onChange={(event) => update("method", event.target.value)} className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring">
            <option value="bank">Bank transfer</option>
            <option value="upi">UPI</option>
            <option value="paypal">PayPal</option>
            <option value="stripe-connect">Stripe Connect</option>
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-black/24 p-4 text-sm leading-6 text-white/58">{methodCopy}</div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/68">
          Account holder name
          <input value={profile.accountHolder} onChange={(event) => update("accountHolder", event.target.value)} className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" placeholder="Creator legal name" />
        </label>
        <label className="grid gap-2 text-sm text-white/68">
          Tax/legal name
          <input value={profile.taxName} onChange={(event) => update("taxName", event.target.value)} className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" placeholder="Name for payout review" />
        </label>
        <label className="grid gap-2 text-sm text-white/68">
          Bank name
          <input value={profile.bankName} onChange={(event) => update("bankName", event.target.value)} className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" placeholder="HDFC, Chase, Barclays" />
        </label>
        <label className="grid gap-2 text-sm text-white/68">
          Account last 4 digits
          <input value={profile.accountLast4} onChange={(event) => update("accountLast4", event.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" maxLength={4} className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" placeholder="1234" />
        </label>
        <label className="grid gap-2 text-sm text-white/68">
          IFSC / routing / sort code
          <input value={profile.ifscOrRouting} onChange={(event) => update("ifscOrRouting", event.target.value)} className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" placeholder="Code used by your bank" />
        </label>
        <label className="grid gap-2 text-sm text-white/68">
          UPI ID
          <input value={profile.upiId} onChange={(event) => update("upiId", event.target.value)} className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" placeholder="name@bank" />
        </label>
        <label className="grid gap-2 text-sm text-white/68 md:col-span-2">
          PayPal email
          <input value={profile.paypalEmail} onChange={(event) => update("paypalEmail", event.target.value)} type="email" className="h-12 rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" placeholder="creator@example.com" />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit">
          <Save size={17} />
          Save payout setup
        </Button>
        {saved ? (
          <span className="inline-flex items-center gap-2 text-sm text-mint">
            <BadgeCheck size={16} />
            Payout details saved for review.
          </span>
        ) : null}
      </div>
    </form>
  );
}

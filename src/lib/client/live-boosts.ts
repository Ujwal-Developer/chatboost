"use client";

import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/utils";

export type LiveBoost = {
  id: string;
  creatorId: string;
  name: string;
  amount: number;
  amountLabel: string;
  currency: string;
  message: string;
  provider: string;
  status: "Approved" | "Delivered" | "Moderating";
  createdAt: string;
  color: string;
};

export const seedBoosts: LiveBoost[] = [
  {
    id: "seed_maya",
    creatorId: "demo-creator",
    name: "Maya",
    amount: 5000,
    amountLabel: "$50",
    currency: "USD",
    message: "That clutch round was unreal. Run it back!",
    provider: "stripe",
    status: "Delivered",
    color: "#ff7a1a",
    createdAt: new Date(Date.now() - 70_000).toISOString()
  },
  {
    id: "seed_arjun",
    creatorId: "demo-creator",
    name: "Arjun",
    amount: 100000,
    amountLabel: "INR 1,000",
    currency: "INR",
    message: "Big boost for the stream setup fund.",
    provider: "razorpay",
    status: "Approved",
    color: "#43d9e8",
    createdAt: new Date(Date.now() - 170_000).toISOString()
  },
  {
    id: "seed_lena",
    creatorId: "demo-creator",
    name: "Lena",
    amount: 2000,
    amountLabel: "EUR 20",
    currency: "EUR",
    message: "Can you shout out the Berlin watch party?",
    provider: "paypal",
    status: "Delivered",
    color: "#3ddc97",
    createdAt: new Date(Date.now() - 260_000).toISOString()
  }
];

const storageKey = "chatboost.liveBoosts";
const channelName = "chatboost.live";

function supportsBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readLiveBoosts(): LiveBoost[] {
  if (!supportsBrowserStorage()) return seedBoosts;

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      window.localStorage.setItem(storageKey, JSON.stringify(seedBoosts));
      return seedBoosts;
    }

    const parsed = JSON.parse(stored) as LiveBoost[];
    return parsed.length > 0 ? parsed : seedBoosts;
  } catch {
    return seedBoosts;
  }
}

export function writeLiveBoosts(boosts: LiveBoost[]) {
  if (!supportsBrowserStorage()) return;
  window.localStorage.setItem(storageKey, JSON.stringify(boosts.slice(0, 20)));
}

export function addLiveBoost(boost: LiveBoost) {
  const next = [boost, ...readLiveBoosts().filter((item) => item.id !== boost.id)].slice(0, 20);
  writeLiveBoosts(next);

  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    const channel = new BroadcastChannel(channelName);
    channel.postMessage({ type: "boost.created", boost });
    channel.close();
  }

  window.dispatchEvent(new CustomEvent("chatboost:boost-created", { detail: boost }));
}

export function clearDemoBoosts() {
  writeLiveBoosts(seedBoosts);
  window.dispatchEvent(new CustomEvent("chatboost:boosts-reset"));
}

export function useLiveBoosts() {
  const [boosts, setBoosts] = useState<LiveBoost[]>(seedBoosts);

  useEffect(() => {
    setBoosts(readLiveBoosts());

    const sync = () => setBoosts(readLiveBoosts());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey) sync();
    };
    const handleCustom = () => sync();
    const channel = "BroadcastChannel" in window ? new BroadcastChannel(channelName) : undefined;

    channel?.addEventListener("message", sync);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("chatboost:boost-created", handleCustom);
    window.addEventListener("chatboost:boosts-reset", handleCustom);

    return () => {
      channel?.close();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("chatboost:boost-created", handleCustom);
      window.removeEventListener("chatboost:boosts-reset", handleCustom);
    };
  }, []);

  return boosts;
}

export function boostFromPaymentResponse(input: {
  creatorId: string;
  displayName: string;
  message: string;
  amount: number;
  currency: string;
  provider: string;
  paymentId: string;
  moderationStatus?: string;
}): LiveBoost {
  return {
    id: input.paymentId,
    creatorId: input.creatorId,
    name: input.displayName,
    amount: input.amount,
    amountLabel: formatMoney(input.amount, input.currency),
    currency: input.currency,
    message: input.message,
    provider: input.provider,
    status: input.moderationStatus === "FLAGGED" ? "Moderating" : "Delivered",
    color: "#ff7a1a",
    createdAt: new Date().toISOString()
  };
}

export function sumBoosts(boosts: LiveBoost[], currency = "USD") {
  return boosts.filter((boost) => boost.currency === currency).reduce((sum, boost) => sum + boost.amount, 0);
}

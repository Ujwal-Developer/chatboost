import { normalizeCreatorHandle } from "@/lib/creator";

export const creatorPlatforms = ["youtube", "twitch", "kick", "instagram", "tiktok", "website", "other"] as const;

export type CreatorPlatform = (typeof creatorPlatforms)[number];

export type CreatorVerificationStatus = "not_started" | "pending" | "verified";

export type CreatorVerificationChecks = {
  email: boolean;
  channel: boolean;
  proofCode: boolean;
  identity: boolean;
  payout: boolean;
};

export const emptyVerificationChecks: CreatorVerificationChecks = {
  email: false,
  channel: false,
  proofCode: false,
  identity: false,
  payout: false
};

export const platformLabels: Record<CreatorPlatform, string> = {
  youtube: "YouTube",
  twitch: "Twitch",
  kick: "Kick",
  instagram: "Instagram",
  tiktok: "TikTok",
  website: "Website",
  other: "Other platform"
};

export function normalizePlatform(input?: string): CreatorPlatform {
  return creatorPlatforms.includes(input as CreatorPlatform) ? (input as CreatorPlatform) : "youtube";
}

export function creatorProofCode(handle: string) {
  return `CHATBOOST-${normalizeCreatorHandle(handle).toUpperCase()}`;
}

export function isLikelyChannelUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function verificationProgress(checks: CreatorVerificationChecks) {
  return Object.values(checks).filter(Boolean).length;
}

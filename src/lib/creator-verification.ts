import { normalizeCreatorHandle } from "@/lib/creator";

export const creatorPlatforms = ["youtube", "twitch", "kick", "instagram", "tiktok", "website", "other"] as const;

export type CreatorPlatform = (typeof creatorPlatforms)[number];

export type CreatorVerificationStatus = "not_started" | "pending" | "in_review" | "rejected" | "verified";

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

export const platformProofGuidance: Record<CreatorPlatform, string> = {
  youtube: "Put the code in the channel About section, a community post, or a pinned video comment.",
  twitch: "Put the code in the channel bio, About panel, or a public schedule/panel link.",
  kick: "Put the code in the channel bio or another public profile section.",
  instagram: "Put the code in the profile bio, public story highlight, or a linked public page.",
  tiktok: "Put the code in the profile bio or a public pinned video caption/comment.",
  website: "Put the code on a public page under your domain, then paste that page URL.",
  other: "Put the code somewhere publicly visible on the official creator profile or linked website."
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

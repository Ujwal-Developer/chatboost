"use client";

import { creatorPaymentPath, defaultCreatorHandle, defaultCreatorName, normalizeCreatorHandle } from "@/lib/creator";
import {
  creatorProofCode,
  emptyVerificationChecks,
  normalizePlatform,
  type CreatorPlatform,
  type CreatorVerificationChecks,
  type CreatorVerificationStatus
} from "@/lib/creator-verification";

export type CreatorProfile = {
  role: "creator";
  email: string;
  displayName: string;
  handle: string;
  platform: CreatorPlatform;
  channelUrl: string;
  channelHandle: string;
  proofCode: string;
  legalName: string;
  payoutCountry: string;
  verificationStatus: CreatorVerificationStatus;
  verificationChecks: CreatorVerificationChecks;
  signedInAt: string;
};

const storageKey = "chatboost.creatorProfile";

export const fallbackCreatorProfile: CreatorProfile = {
  role: "creator",
  email: "creator@chatboost.local",
  displayName: defaultCreatorName,
  handle: defaultCreatorHandle,
  platform: "youtube",
  channelUrl: "https://youtube.com/@nova",
  channelHandle: "@nova",
  proofCode: creatorProofCode(defaultCreatorHandle),
  legalName: "",
  payoutCountry: "US",
  verificationStatus: "not_started",
  verificationChecks: emptyVerificationChecks,
  signedInAt: new Date(0).toISOString()
};

export function readCreatorProfile() {
  if (typeof window === "undefined") return fallbackCreatorProfile;

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return fallbackCreatorProfile;

    const parsed = JSON.parse(stored) as Partial<CreatorProfile>;
    return {
      ...fallbackCreatorProfile,
      ...parsed,
      role: "creator" as const,
      handle: normalizeCreatorHandle(parsed.handle ?? fallbackCreatorProfile.handle),
      platform: normalizePlatform(parsed.platform),
      proofCode: parsed.proofCode ?? creatorProofCode(parsed.handle ?? fallbackCreatorProfile.handle),
      verificationChecks: {
        ...emptyVerificationChecks,
        ...parsed.verificationChecks
      }
    };
  } catch {
    return fallbackCreatorProfile;
  }
}

export function saveCreatorProfile(
  profile: Partial<Omit<CreatorProfile, "role" | "signedInAt" | "platform">> & { email: string; displayName: string; handle: string; platform?: string }
) {
  if (typeof window === "undefined") return fallbackCreatorProfile;

  const current = readCreatorProfile();
  const handle = normalizeCreatorHandle(profile.handle);
  const next: CreatorProfile = {
    ...current,
    role: "creator",
    email: profile.email,
    displayName: profile.displayName.trim() || defaultCreatorName,
    handle,
    platform: normalizePlatform(profile.platform),
    channelUrl: profile.channelUrl?.trim() ?? current.channelUrl,
    channelHandle: profile.channelHandle?.trim() ?? current.channelHandle,
    proofCode: profile.proofCode ?? creatorProofCode(handle),
    legalName: profile.legalName?.trim() ?? current.legalName,
    payoutCountry: profile.payoutCountry?.trim().toUpperCase() ?? current.payoutCountry,
    verificationStatus: profile.verificationStatus ?? current.verificationStatus,
    verificationChecks: profile.verificationChecks ?? current.verificationChecks,
    signedInAt: new Date().toISOString()
  };

  window.localStorage.setItem(storageKey, JSON.stringify(next));
  window.localStorage.setItem("chatboost.session", JSON.stringify(next));
  return next;
}

export function creatorShareUrl(profile: { handle: string } = readCreatorProfile()) {
  if (typeof window === "undefined") return creatorPaymentPath(profile.handle);
  return `${window.location.origin}${creatorPaymentPath(profile.handle)}`;
}

"use client";

import { creatorPaymentPath, defaultCreatorHandle, defaultCreatorName, normalizeCreatorHandle } from "@/lib/creator";

export type CreatorProfile = {
  role: "creator";
  email: string;
  displayName: string;
  handle: string;
  signedInAt: string;
};

const storageKey = "chatboost.creatorProfile";

export const fallbackCreatorProfile: CreatorProfile = {
  role: "creator",
  email: "creator@chatboost.local",
  displayName: defaultCreatorName,
  handle: defaultCreatorHandle,
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
      handle: normalizeCreatorHandle(parsed.handle ?? fallbackCreatorProfile.handle)
    };
  } catch {
    return fallbackCreatorProfile;
  }
}

export function saveCreatorProfile(profile: Omit<CreatorProfile, "role" | "signedInAt">) {
  if (typeof window === "undefined") return fallbackCreatorProfile;

  const next: CreatorProfile = {
    role: "creator",
    email: profile.email,
    displayName: profile.displayName.trim() || defaultCreatorName,
    handle: normalizeCreatorHandle(profile.handle),
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

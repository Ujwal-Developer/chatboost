"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CircleUserRound, Clock3, LogIn, ShieldAlert } from "lucide-react";
import { fallbackCreatorProfile, readCreatorProfile, type CreatorProfile } from "@/lib/client/creator-profile";

function statusCopy(profile: CreatorProfile) {
  if (profile.verificationStatus === "verified") {
    return { label: "Verified creator", icon: BadgeCheck, className: "text-mint" };
  }

  if (profile.verificationStatus === "in_review") {
    return { label: "In review", icon: Clock3, className: "text-ember" };
  }

  if (profile.verificationStatus === "rejected") {
    return { label: "Needs resubmission", icon: ShieldAlert, className: "text-ember" };
  }

  return { label: "Signed in", icon: CircleUserRound, className: "text-white/62" };
}

export function CreatorAccountStatus() {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);

  useEffect(() => {
    const next = readCreatorProfile();
    setProfile(next.signedInAt === fallbackCreatorProfile.signedInAt ? null : next);
  }, []);

  if (!profile) {
    return (
      <Link href="/login/creator" className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white/6 px-3 text-sm text-white/70 hover:bg-white/10 hover:text-white">
        <LogIn size={17} />
        Creator login
      </Link>
    );
  }

  const status = statusCopy(profile);
  const StatusIcon = status.icon;

  return (
    <Link href="/creator/verification" className="flex h-10 min-w-0 items-center gap-3 rounded-lg border border-line bg-white/6 px-3 text-left hover:bg-white/10">
      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-black text-sm font-semibold text-white">{profile.displayName.charAt(0).toUpperCase()}</span>
      <span className="hidden min-w-0 sm:block">
        <span className="block max-w-40 truncate text-sm font-medium text-white">{profile.displayName}</span>
        <span className={`flex items-center gap-1 text-xs ${status.className}`}>
          <StatusIcon size={12} />
          @{profile.handle} · {status.label}
        </span>
      </span>
    </Link>
  );
}

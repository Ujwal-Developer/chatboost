"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BadgeCheck, CheckCircle2, ExternalLink, IdCard, LinkIcon, ShieldCheck, WalletCards, Youtube } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { creatorPaymentPath, defaultCreatorHandle, defaultCreatorName, normalizeCreatorHandle } from "@/lib/creator";
import { creatorShareUrl, fallbackCreatorProfile, readCreatorProfile, saveCreatorProfile, submitCreatorForManualReview, type CreatorProfile } from "@/lib/client/creator-profile";
import {
  creatorPlatforms,
  creatorProofCode,
  emptyVerificationChecks,
  isLikelyChannelUrl,
  platformLabels,
  verificationProgress
} from "@/lib/creator-verification";

type InitialVerificationProfile = {
  email?: string;
  displayName?: string;
  handle?: string;
  platform?: string;
  channelUrl?: string;
  auth?: string;
};

type CreatorOAuthSessionResponse = {
  mode: "real" | "demo";
  authenticated: boolean;
  session: null | {
    email: string;
    name: string;
    channelTitle: string;
    channelHandle: string;
    channelUrl: string;
    handle: string;
    proofCode: string;
    verifiedAt: string;
  };
};

function profileFromInitial(initialProfile?: InitialVerificationProfile): CreatorProfile {
  const current = readCreatorProfile();
  const handle = normalizeCreatorHandle(initialProfile?.handle ?? current.handle ?? defaultCreatorHandle);

  return {
    ...current,
    email: initialProfile?.email?.trim() || current.email,
    displayName: initialProfile?.displayName?.trim() || current.displayName || defaultCreatorName,
    handle,
    platform: creatorPlatforms.includes(initialProfile?.platform as CreatorProfile["platform"]) ? (initialProfile?.platform as CreatorProfile["platform"]) : current.platform,
    channelUrl: initialProfile?.channelUrl?.trim() || current.channelUrl,
    proofCode: creatorProofCode(handle)
  };
}

export function CreatorVerificationClient({ initialProfile }: { initialProfile?: InitialVerificationProfile }) {
  const [profile, setProfile] = useState<CreatorProfile>(fallbackCreatorProfile);
  const [statusMessage, setStatusMessage] = useState("");
  const [authMode, setAuthMode] = useState<"checking" | "real" | "demo">("checking");
  const progress = verificationProgress(profile.verificationChecks);
  const shareUrl = useMemo(() => creatorShareUrl(profile), [profile]);
  const isVerified = profile.verificationStatus === "verified";
  const isInReview = profile.verificationStatus === "in_review";

  useEffect(() => {
    const next = profileFromInitial(initialProfile);
    setProfile(saveCreatorProfile(next));
  }, [initialProfile]);

  useEffect(() => {
    let cancelled = false;

    async function loadOAuthSession() {
      try {
        const response = await fetch("/api/auth/creator/session");
        const payload = (await response.json()) as CreatorOAuthSessionResponse;
        if (cancelled) return;

        setAuthMode(payload.mode);

        if (payload.authenticated && payload.session) {
          const currentProfile = readCreatorProfile();
          const next = saveCreatorProfile({
            email: payload.session.email,
            displayName: payload.session.channelTitle || payload.session.name,
            handle: payload.session.handle,
            platform: "youtube",
            channelUrl: payload.session.channelUrl,
            channelHandle: payload.session.channelHandle,
            proofCode: payload.session.proofCode,
            verificationChecks: {
              ...emptyVerificationChecks,
              email: true,
              channel: true,
              proofCode: true,
              identity: currentProfile.verificationChecks.identity,
              payout: currentProfile.verificationChecks.payout
            },
            verificationStatus: currentProfile.verificationChecks.identity && currentProfile.verificationChecks.payout ? "in_review" : "pending",
            legalName: currentProfile.legalName,
            payoutCountry: currentProfile.payoutCountry
          });
          setProfile(next);
          setStatusMessage("Real YouTube account connected. Finish identity and payout fields, then submit for admin review.");
        }
      } catch {
        if (!cancelled) setAuthMode("demo");
      }
    }

    loadOAuthSession();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const handle = normalizeCreatorHandle(String(data.get("handle") ?? profile.handle));
    const channelUrl = String(data.get("channelUrl") ?? "").trim();
    const legalName = String(data.get("legalName") ?? "").trim();
    const payoutCountry = String(data.get("payoutCountry") ?? "").trim().toUpperCase();
    const proofConfirmed = data.get("proofConfirmed") === "on";

    const verificationChecks = {
      email: String(data.get("email") ?? "").includes("@"),
      channel: isLikelyChannelUrl(channelUrl),
      proofCode: proofConfirmed,
      identity: legalName.length >= 2,
      payout: payoutCountry.length === 2
    };

    const checksComplete = verificationProgress(verificationChecks) === 5;
    const next = saveCreatorProfile({
      email: String(data.get("email") ?? profile.email),
      displayName: String(data.get("displayName") ?? profile.displayName),
      handle,
      platform: String(data.get("platform") ?? profile.platform),
      channelUrl,
      channelHandle: String(data.get("channelHandle") ?? ""),
      legalName,
      payoutCountry,
      proofCode: creatorProofCode(handle),
      verificationChecks,
      verificationStatus: checksComplete ? "in_review" : "pending"
    });

    if (checksComplete) {
      submitCreatorForManualReview(next);
    }

    setProfile(next);
    setStatusMessage(
      checksComplete
        ? "Verification submitted for admin review. The payment link unlocks after approval."
        : "Verification saved. Complete every check before submitting for admin review."
    );
  }

  return (
    <AppShell title="Creator verification">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="surface rounded-lg p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-ember">
                <ShieldCheck size={17} />
                Creator authentication
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Verify this is your real channel</h2>
              <p className="mt-3 max-w-2xl leading-7 text-white/62">
                ChatBoost should only activate payments after channel ownership, identity, payout readiness, and admin approval are complete.
              </p>
            </div>
            <span className={`rounded-lg border px-3 py-2 text-sm font-semibold ${isVerified ? "border-mint/35 bg-mint/10 text-mint" : "border-ember/35 bg-ember/10 text-ember"}`}>
              {isVerified ? "Verified" : isInReview ? "In admin review" : `${progress}/5 checks`}
            </span>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit} data-testid="creator-verification-form">
            <div className="rounded-lg border border-line bg-black/25 p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-white">Real account connection</p>
                  <p className="mt-1 text-sm leading-6 text-white/58">
                    {authMode === "real"
                      ? "YouTube OAuth is configured. Connect the creator account to verify the real channel."
                      : authMode === "demo"
                        ? "YouTube OAuth is not fully configured yet. Add the Vercel environment variables below to test with a real account."
                        : "Checking real authentication configuration..."}
                  </p>
                </div>
                <ButtonLink href="/api/auth/youtube/start" variant={authMode === "real" ? "primary" : "secondary"}>
                  <Youtube size={17} />
                  Connect YouTube
                </ButtonLink>
              </div>
              {initialProfile?.auth === "missing-youtube-env" ? (
                <p className="mt-3 rounded-lg border border-ember/30 bg-ember/10 p-3 text-sm text-ember">
                  Real YouTube login is not configured yet. Add `AUTH_SECRET`, `YOUTUBE_CLIENT_ID`, and `YOUTUBE_CLIENT_SECRET` in Vercel, then redeploy.
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm text-white/62" htmlFor="displayName">
                Creator name
                <input id="displayName" name="displayName" required defaultValue={profile.displayName} className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" />
              </label>
              <label className="block text-sm text-white/62" htmlFor="email">
                Creator email
                <input id="email" name="email" type="email" required defaultValue={profile.email} className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm text-white/62" htmlFor="handle">
                ChatBoost handle
                <input id="handle" name="handle" required defaultValue={profile.handle} className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" />
              </label>
              <label className="block text-sm text-white/62" htmlFor="platform">
                Platform
                <select id="platform" name="platform" defaultValue={profile.platform} className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring">
                  {creatorPlatforms.map((platform) => (
                    <option key={platform} value={platform} className="bg-black">
                      {platformLabels[platform]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-sm text-white/62" htmlFor="channelUrl">
              Official channel/profile URL
              <input id="channelUrl" name="channelUrl" type="url" required defaultValue={profile.channelUrl} className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" />
            </label>

            <label className="block text-sm text-white/62" htmlFor="channelHandle">
              Public channel handle
              <input id="channelHandle" name="channelHandle" required defaultValue={profile.channelHandle || `@${profile.handle}`} className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" />
            </label>

            <div className="rounded-lg border border-line bg-black/25 p-4">
              <p className="text-sm font-semibold text-white">Ownership proof code</p>
              <p className="mt-2 text-sm leading-6 text-white/58">Add this code to the channel bio, about section, pinned post, or website page, then confirm it below.</p>
              <div className="mt-3 rounded-lg border border-ember/30 bg-ember/10 p-3 font-mono text-sm text-ember">{creatorProofCode(profile.handle)}</div>
              <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-white/68">
                <input name="proofConfirmed" type="checkbox" defaultChecked={profile.verificationChecks.proofCode} className="mt-1 size-4 accent-[#ff7a1a]" />
                I added the proof code to my public channel/profile so ChatBoost can confirm ownership.
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm text-white/62" htmlFor="legalName">
                Legal name for payout review
                <input id="legalName" name="legalName" required defaultValue={profile.legalName} className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring" />
              </label>
              <label className="block text-sm text-white/62" htmlFor="payoutCountry">
                Payout country code
                <input id="payoutCountry" name="payoutCountry" required minLength={2} maxLength={2} defaultValue={profile.payoutCountry} className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 uppercase text-white outline-none focus-visible:focus-ring" />
              </label>
            </div>

            {statusMessage ? <p className="rounded-lg border border-mint/25 bg-mint/10 p-3 text-sm text-mint">{statusMessage}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit">
                <BadgeCheck size={17} />
                Submit for admin review
              </Button>
              <ButtonLink href="/dashboard/creator" variant="secondary">
                Go to dashboard
              </ButtonLink>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          {[
            [LinkIcon, "Channel ownership", profile.verificationChecks.channel && profile.verificationChecks.proofCode ? "Verified by URL and public proof code" : "Needs a valid channel URL and public proof code"],
            [IdCard, "Identity", profile.verificationChecks.identity ? "Legal creator name captured" : "Needed before payouts"],
            [WalletCards, "Payout readiness", profile.verificationChecks.payout ? "Country captured for provider routing" : "Needed for tax and payout checks"],
            [CheckCircle2, "Payment link", isVerified ? shareUrl : isInReview ? "Waiting for admin approval" : "Locked until all checks pass and admin approves"]
          ].map(([Icon, title, body]) => {
            const TypedIcon = Icon as typeof ShieldCheck;
            return (
              <section key={title as string} className="rounded-lg border border-line bg-white/[0.06] p-5">
                <TypedIcon className="text-ember" size={22} />
                <h3 className="mt-4 font-semibold">{title as string}</h3>
                <p className="mt-2 break-words text-sm leading-6 text-white/58">{body as string}</p>
              </section>
            );
          })}

          {isVerified ? (
            <ButtonLink href={creatorPaymentPath(profile.handle)} className="w-full">
              <ExternalLink size={17} />
              Open verified payment page
            </ButtonLink>
          ) : null}
        </aside>
      </div>
    </AppShell>
  );
}

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BadgeCheck, CheckCircle2, ExternalLink, IdCard, LinkIcon, ShieldCheck, WalletCards } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { creatorPaymentPath, defaultCreatorHandle, defaultCreatorName, normalizeCreatorHandle } from "@/lib/creator";
import { creatorShareUrl, fallbackCreatorProfile, readCreatorProfile, saveCreatorProfile, submitCreatorForManualReview, type CreatorProfile } from "@/lib/client/creator-profile";
import {
  creatorPlatforms,
  creatorProofCode,
  isLikelyChannelUrl,
  normalizePlatform,
  platformLabels,
  platformProofGuidance,
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
  const [selectedPlatform, setSelectedPlatform] = useState(profile.platform);
  const progress = verificationProgress(profile.verificationChecks);
  const shareUrl = useMemo(() => creatorShareUrl(profile), [profile]);
  const isVerified = profile.verificationStatus === "verified";
  const isInReview = profile.verificationStatus === "in_review";

  useEffect(() => {
    const next = profileFromInitial(initialProfile);
    setProfile(saveCreatorProfile(next));
    setSelectedPlatform(next.platform);
  }, [initialProfile]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const handle = normalizeCreatorHandle(String(data.get("handle") ?? profile.handle));
    const channelUrl = String(data.get("channelUrl") ?? "").trim();
    const proofLocationUrl = String(data.get("proofLocationUrl") ?? "").trim();
    const legalName = String(data.get("legalName") ?? "").trim();
    const payoutCountry = String(data.get("payoutCountry") ?? "").trim().toUpperCase();
    const proofConfirmed = data.get("proofConfirmed") === "on";
    const channelOwned = isLikelyChannelUrl(channelUrl);
    const proofVisible = proofConfirmed && isLikelyChannelUrl(proofLocationUrl);

    const verificationChecks = {
      email: String(data.get("email") ?? "").includes("@"),
      channel: channelOwned,
      proofCode: proofVisible,
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
      proofLocationUrl,
      legalName,
      payoutCountry,
      proofCode: creatorProofCode(handle),
      verificationChecks,
      verificationStatus: checksComplete ? "in_review" : "pending",
      connectedAccounts: profile.connectedAccounts
    });

    if (checksComplete) {
      submitCreatorForManualReview(next);
    }

    setProfile(next);
    setStatusMessage(
      checksComplete
        ? "Verification submitted for platform review. The payment link unlocks after approval."
        : proofVisible && channelOwned
          ? "Channel proof saved. Complete identity and payout fields when you are ready to unlock payments."
          : "Verification saved. Add the proof code to a public page and paste the proof location URL."
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
                Worldwide creators can verify ownership by placing a unique ChatBoost code on their public channel, profile, or linked website.
              </p>
            </div>
            <span className={`rounded-lg border px-3 py-2 text-sm font-semibold ${isVerified ? "border-mint/35 bg-mint/10 text-mint" : "border-ember/35 bg-ember/10 text-ember"}`}>
              {isVerified ? "Verified" : isInReview ? "In platform review" : `${progress}/5 checks`}
            </span>
          </div>

          <form
            key={`${profile.email}-${profile.handle}-${profile.channelUrl}-${profile.connectedAccounts.length}`}
            className="mt-6 grid gap-4"
            onSubmit={handleSubmit}
            data-testid="creator-verification-form"
          >
            <div className="rounded-lg border border-line bg-black/25 p-4">
              <p className="text-sm font-semibold text-white">Universal channel proof</p>
              <p className="mt-2 text-sm leading-6 text-white/58">
                Works for YouTube, Twitch, Kick, Instagram, TikTok, a website, or any public creator profile. The proof code is reviewed before the payment link can unlock.
              </p>
              <ol className="mt-4 grid gap-2 text-sm leading-6 text-white/68">
                <li className="rounded-lg border border-line bg-black/24 px-3 py-2">1. Paste your official channel/profile URL below.</li>
                <li className="rounded-lg border border-line bg-black/24 px-3 py-2">2. Put the ChatBoost proof code in a public bio, about section, pinned post, panel, or linked website.</li>
                <li className="rounded-lg border border-line bg-black/24 px-3 py-2">3. Paste the exact public URL where the code can be checked.</li>
              </ol>
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
                <select
                  id="platform"
                  name="platform"
                  defaultValue={profile.platform}
                  onChange={(event) => setSelectedPlatform(normalizePlatform(event.currentTarget.value))}
                  className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring"
                >
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
              <p className="mt-2 text-sm leading-6 text-white/58">{platformProofGuidance[selectedPlatform]}</p>
              <div className="mt-3 rounded-lg border border-ember/30 bg-ember/10 p-3 font-mono text-sm text-ember">{creatorProofCode(profile.handle)}</div>
              <label className="mt-4 block text-sm text-white/62" htmlFor="proofLocationUrl">
                Public URL where the proof code is visible
                <input
                  id="proofLocationUrl"
                  name="proofLocationUrl"
                  type="url"
                  required
                  defaultValue={profile.proofLocationUrl || profile.channelUrl}
                  className="mt-2 h-12 w-full rounded-lg border border-line bg-black/35 px-3 text-white outline-none focus-visible:focus-ring"
                />
              </label>
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
                Submit for review
              </Button>
              <ButtonLink href="/dashboard/creator" variant="secondary">
                Go to dashboard
              </ButtonLink>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          {[
            [LinkIcon, "Channel ownership", profile.verificationChecks.channel && profile.verificationChecks.proofCode ? "Ready for proof-code review" : "Add a public proof-code URL for any supported creator platform"],
            [IdCard, "Identity", profile.verificationChecks.identity ? "Legal creator name captured" : "Needed before payouts"],
            [WalletCards, "Payout readiness", profile.verificationChecks.payout ? "Country captured for provider routing" : "Needed for tax and payout checks"],
            [CheckCircle2, "Payment link", isVerified ? shareUrl : isInReview ? "Waiting for platform approval" : "Locked until all checks pass and review is approved"]
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

"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Clock3, Copy, Download, ExternalLink, RadioTower, RotateCcw, ShieldCheck, Share2, UserRound, WandSparkles } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { Metric } from "@/components/ui/metric";
import { Button, ButtonLink } from "@/components/ui/button";
import { creatorStats, topSupporters } from "@/lib/data/demo";
import { clearDemoBoosts, sumBoosts, useLiveBoosts } from "@/lib/client/live-boosts";
import { creatorPaymentPath } from "@/lib/creator";
import { creatorShareUrl, fallbackCreatorProfile, readCreatorProfile, saveCreatorProfile, type CreatorProfile } from "@/lib/client/creator-profile";
import { normalizePlatform } from "@/lib/creator-verification";
import { formatMoney } from "@/lib/utils";

type InitialCreatorProfile = {
  displayName: string;
  handle: string;
  email: string;
  platform?: string;
  channelUrl?: string;
};

export function CreatorDashboardClient({ initialProfile }: { initialProfile?: InitialCreatorProfile }) {
  const boosts = useLiveBoosts();
  const fallbackProfile: CreatorProfile = initialProfile ? { ...fallbackCreatorProfile, ...initialProfile, platform: normalizePlatform(initialProfile.platform) } : fallbackCreatorProfile;
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile>(fallbackProfile);
  const [shareUrl, setShareUrl] = useState(creatorPaymentPath(fallbackProfile.handle));
  const [copied, setCopied] = useState(false);
  const isVerified = creatorProfile.verificationStatus === "verified";
  const isInReview = creatorProfile.verificationStatus === "in_review";
  const isRejected = creatorProfile.verificationStatus === "rejected";
  const verificationLabel = isVerified ? "Verified" : isInReview ? "In admin review" : isRejected ? "Rejected" : "Verification needed";
  const todayRevenue = sumBoosts(boosts);
  const stats = [
    { label: "Live revenue", value: formatMoney(todayRevenue), delta: `${boosts.length} boosts` },
    { label: "Today", value: formatMoney(todayRevenue), delta: "Live" },
    creatorStats[2],
    { label: "Net creator earnings", value: formatMoney(Math.round(todayRevenue * 0.87)), delta: "After fees" }
  ];

  useEffect(() => {
    const profile = initialProfile ? saveCreatorProfile(initialProfile) : readCreatorProfile();
    setCreatorProfile(profile);
    setShareUrl(creatorShareUrl(profile));
  }, [initialProfile]);

  async function copyShareLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <AppShell title="Creator dashboard">
      <section className="mb-6 rounded-lg border border-line bg-white/[0.07] p-5">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-ember">
              <UserRound size={17} />
              Logged in creator account
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold">{creatorProfile.displayName}</h2>
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${isVerified ? "bg-mint/12 text-mint" : "bg-ember/10 text-ember"}`}>
                {isInReview ? <Clock3 size={14} /> : isVerified ? <Share2 size={14} /> : <AlertTriangle size={14} />}
                {verificationLabel}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/45">@{creatorProfile.handle} · {creatorProfile.email}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">
              {isVerified
                ? "Share this link with viewers. It opens a payment page with name, message, amount, and payment method fields."
                : isInReview
                  ? "Your creator account is logged in and waiting for admin approval. The payment link unlocks after review."
                  : "Verify channel ownership, identity, and payout readiness before collecting money as this creator."}
            </p>
          </div>
          <div className="min-w-0 rounded-lg border border-line bg-black/30 p-3 xl:w-[520px]">
            {isVerified ? (
              <>
                <p className="truncate font-mono text-sm text-white/76">{shareUrl}</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Button className="flex-1" type="button" onClick={copyShareLink}>
                    {copied ? <Check size={17} /> : <Copy size={17} />}
                    {copied ? "Copied" : "Copy link"}
                  </Button>
                  <ButtonLink className="flex-1" href={creatorPaymentPath(creatorProfile.handle)} variant="secondary">
                    <ExternalLink size={17} />
                    Open page
                  </ButtonLink>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-6 text-white/58">
                  {isInReview ? "Payment link locked while admin reviews your creator proof." : "Payment link locked until creator verification is complete."}
                </p>
                <ButtonLink href="/creator/verification">
                  <ShieldCheck size={17} />
                  {isInReview ? "View review status" : "Verify creator"}
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Metric key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="surface rounded-lg p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ember">Live activity</p>
              <h2 className="mt-1 text-2xl font-semibold">Paid messages</h2>
            </div>
            <ButtonLink href="/overlay/demo-creator" variant="secondary">
              <RadioTower size={17} />
              Preview overlay
            </ButtonLink>
          </div>
          <div className="mt-5 space-y-3" data-testid="dashboard-boosts">
            {boosts.map((item) => (
              <div key={item.id} className="rounded-lg border border-line bg-black/26 p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong>{item.name}</strong>
                  <span className="font-semibold text-ember">{item.amountLabel}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/64">{item.message}</p>
                <p className="mt-3 text-xs text-white/38">
                  {item.status} via {item.provider}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="surface rounded-lg p-5">
            <h2 className="text-xl font-semibold">Top supporters</h2>
            <div className="mt-4 space-y-3">
              {topSupporters.map((supporter) => (
                <div key={supporter.name} className="flex items-center justify-between rounded-lg border border-line bg-white/6 p-3">
                  <div>
                    <p className="font-medium">{supporter.name}</p>
                    <p className="text-sm text-white/46">{supporter.badge}</p>
                  </div>
                  <span className="text-sm font-semibold text-mint">{supporter.total}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="surface rounded-lg p-5">
            <h2 className="text-xl font-semibold">Overlay settings</h2>
            <div className="mt-4 grid gap-3">
              {["Orange alert theme", "Voice reading", "Goal bar", "Top supporter banner"].map((setting, index) => (
                <label key={setting} className="flex items-center justify-between rounded-lg border border-line bg-white/6 p-3 text-sm">
                  {setting}
                  <input type="checkbox" defaultChecked={index !== 1} className="size-4 accent-[#ff7a1a]" />
                </label>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/api/analytics/export" variant="secondary">
          <Download size={17} />
          Export CSV
        </ButtonLink>
        <ButtonLink href="/settings" variant="secondary">
          <WandSparkles size={17} />
          Moderation settings
        </ButtonLink>
        <Button type="button" variant="secondary" onClick={clearDemoBoosts}>
          <RotateCcw size={17} />
          Reset demo activity
        </Button>
      </div>
    </AppShell>
  );
}

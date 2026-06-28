"use client";

import { Download, RadioTower, RotateCcw, WandSparkles } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { Metric } from "@/components/ui/metric";
import { Button, ButtonLink } from "@/components/ui/button";
import { creatorStats, topSupporters } from "@/lib/data/demo";
import { clearDemoBoosts, sumBoosts, useLiveBoosts } from "@/lib/client/live-boosts";
import { formatMoney } from "@/lib/utils";

export function CreatorDashboardClient() {
  const boosts = useLiveBoosts();
  const todayRevenue = sumBoosts(boosts);
  const stats = [
    { label: "Live revenue", value: formatMoney(todayRevenue), delta: `${boosts.length} boosts` },
    { label: "Today", value: formatMoney(todayRevenue), delta: "Live" },
    creatorStats[2],
    { label: "Net creator earnings", value: formatMoney(Math.round(todayRevenue * 0.87)), delta: "After fees" }
  ];

  return (
    <AppShell title="Creator dashboard">
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

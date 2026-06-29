import { AlertTriangle, BadgeDollarSign, Banknote, ShieldCheck, UsersRound } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/dashboard/app-shell";
import { Metric } from "@/components/ui/metric";
import { adminMetrics } from "@/lib/data/demo";

export default function AdminPage() {
  return (
    <AppShell title="Admin dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <Metric key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="surface rounded-lg p-5">
          <h2 className="text-2xl font-semibold">Operations queue</h2>
          <div className="mt-5 grid gap-3">
            {[
              [AlertTriangle, "Fraud review", "42 high-risk payments need manual review", "High"],
              [ShieldCheck, "Creator verification", "Creator ownership proofs waiting for admin approval", "High"],
              [Banknote, "Payout approval", "318 creator payouts waiting for release", "Medium"],
              [UsersRound, "User management", "19 suspended account appeals", "Medium"],
              [BadgeDollarSign, "Refund queue", "73 refund requests across 11 currencies", "Normal"]
            ].map(([Icon, title, body, priority]) => {
              const TypedIcon = Icon as typeof AlertTriangle;
              return (
                <div key={title as string} className="flex gap-4 rounded-lg border border-line bg-black/24 p-4">
                  <TypedIcon className="mt-1 text-ember" size={22} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <strong>{title as string}</strong>
                      <span className="rounded-full bg-white/8 px-2 py-1 text-xs text-white/54">{priority as string}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/58">{body as string}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="surface rounded-lg p-5">
          <ShieldCheck className="text-mint" size={26} />
          <h2 className="mt-5 text-2xl font-semibold">Platform controls</h2>
          <div className="mt-5 grid gap-3">
            {[
              ["Creator verification", "/admin/creator-verification"],
              ["Provider health", "/admin/provider-health"],
              ["Webhook failures", "/admin/webhook-failures"],
              ["Audit logs", "/admin/audit-logs"],
              ["Rate-limit incidents", "/admin/rate-limit-incidents"],
              ["Platform settings", "/admin/platform-settings"]
            ].map(([item, href]) => (
              <Link key={item} href={href} className="flex h-12 items-center justify-between rounded-lg border border-line bg-white/6 px-4 text-left text-sm text-white/74 hover:bg-white/10">
                <span>{item}</span>
                <span className="text-white/35">Open</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

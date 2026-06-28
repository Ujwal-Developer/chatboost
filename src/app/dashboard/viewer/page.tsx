import { Heart, ReceiptText, Trophy, WalletCards } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { Metric } from "@/components/ui/metric";

export default function ViewerDashboardPage() {
  return (
    <AppShell title="Viewer dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total spent", value: "$840", delta: "12 creators" },
          { label: "Messages sent", value: "68", delta: "+6 this week" },
          { label: "Favorite creators", value: "9", delta: "3 live" },
          { label: "Badges earned", value: "14", delta: "Gold tier" }
        ].map((metric) => (
          <Metric key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {[
          [ReceiptText, "Payment history", "Receipts, refund requests, payment methods, and tax-ready exports."],
          [Heart, "Favorites", "Follow creators and jump straight into their active livestream pages."],
          [Trophy, "Loyalty badges", "Track supporter milestones across memberships and one-time boosts."],
          [WalletCards, "Memberships", "Manage recurring creator memberships and upgrade paths."]
        ].map(([Icon, title, body]) => {
          const TypedIcon = Icon as typeof Heart;
          return (
            <section key={title as string} className="surface rounded-lg p-5">
              <TypedIcon className="text-ember" size={24} />
              <h2 className="mt-5 text-xl font-semibold">{title as string}</h2>
              <p className="mt-3 leading-7 text-white/64">{body as string}</p>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}

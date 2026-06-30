import { AppShell } from "@/components/dashboard/app-shell";
import { PayoutSettingsClient } from "@/components/settings/payout-settings-client";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="grid gap-6">
        <PayoutSettingsClient />

      <section className="surface rounded-lg p-5">
        <h2 className="text-2xl font-semibold">Account settings</h2>
        <div className="mt-5 grid gap-4">
          {["Email receipts", "Fraud alerts", "Weekly creator report", "Overlay sound effects"].map((item, index) => (
            <label key={item} className="flex items-center justify-between rounded-lg border border-line bg-black/25 p-4 text-sm">
              {item}
              <input type="checkbox" defaultChecked={index !== 3} className="size-4 accent-[#ff7a1a]" />
            </label>
          ))}
        </div>
      </section>
      </div>
    </AppShell>
  );
}

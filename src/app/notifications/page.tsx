import { CheckCircle2, CircleDollarSign, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";

export default function NotificationsPage() {
  return (
    <AppShell title="Notifications">
      <div className="grid gap-4">
        {[
          [CircleDollarSign, "New boost delivered", "Maya sent $50.00 and the overlay updated successfully."],
          [ShieldAlert, "Moderation review", "One message is waiting for manual review."],
          [CheckCircle2, "Payout ready", "$1,923 is scheduled for the next payout window."]
        ].map(([Icon, title, body]) => {
          const TypedIcon = Icon as typeof CircleDollarSign;
          return (
            <section key={title as string} className="surface flex gap-4 rounded-lg p-5">
              <TypedIcon className="mt-1 text-ember" size={22} />
              <div>
                <h2 className="font-semibold">{title as string}</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">{body as string}</p>
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}

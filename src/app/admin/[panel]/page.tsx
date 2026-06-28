import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";

const panelCopy: Record<string, string> = {
  "provider-health": "Payment providers are online. Stripe, Razorpay, PayPal, and UPI demo adapters are responding.",
  "webhook-failures": "No unhandled webhook failures in the demo queue. Signature and idempotency checks are active.",
  "audit-logs": "Admin actions, login events, payout changes, refunds, and API key updates are captured here.",
  "rate-limit-incidents": "No active rate-limit incidents. Public payment endpoints are protected by request buckets.",
  "platform-settings": "Platform fee, supported currencies, provider routing, and moderation defaults live here."
};

export default async function AdminPanelPage({ params }: { params: Promise<{ panel: string }> }) {
  const { panel } = await params;
  const title = panel
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <AppShell title={title}>
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
        <ArrowLeft size={16} />
        Back to admin
      </Link>
      <section className="surface mt-5 max-w-3xl rounded-lg p-6">
        <CheckCircle2 className="text-mint" size={26} />
        <h2 className="mt-5 text-2xl font-semibold">{title}</h2>
        <p className="mt-4 leading-7 text-white/64">{panelCopy[panel] ?? "This admin panel is ready for the next production workflow."}</p>
      </section>
    </AppShell>
  );
}

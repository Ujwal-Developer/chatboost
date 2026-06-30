import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe2, LogIn, RadioTower, ShieldCheck, Zap } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SiteNav, featureIcons } from "@/components/marketing/site-nav";

const features = [
  "Guest checkout stays short: name, message, amount, local payment method.",
  "Every creator gets a revocable OBS browser-source overlay URL.",
  "Payment providers are adapters, not hard-coded business logic.",
  "Moderation, voice, receipts, payouts, and analytics run as separate jobs."
];

const roadmap = ["YouTube beta", "Payout ledger", "Twitch and Kick", "Memberships", "Global payout expansion"];

function HeroConsole() {
  return (
    <div className="rounded-lg border border-line bg-[#0d0d0d]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Live room</p>
          <p className="mt-1 text-sm font-medium text-white">Nova Plays / YouTube</p>
        </div>
        <span className="rounded-md border border-mint/30 bg-mint/10 px-2 py-1 text-xs text-mint">Healthy</span>
      </div>

      <div className="grid gap-px bg-line lg:grid-cols-[1.1fr_0.9fr]">
        <section className="bg-[#0d0d0d] p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Live revenue", "$4,208"],
              ["Pending", "$1,923"],
              ["Latency", "184 ms"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-line bg-black/35 p-3">
                <p className="text-xs text-white/45">{label}</p>
                <strong className="mt-2 block text-xl font-semibold">{value}</strong>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-line bg-black/30">
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <p className="text-sm font-medium">Payment queue</p>
              <p className="text-xs text-white/42">4 events in last minute</p>
            </div>
            <div className="divide-y divide-line">
              {[
                ["Maya", "$50.00", "Approved", "That clutch round was unreal."],
                ["Arjun", "₹1,000", "Moderating", "Big boost for the setup fund."],
                ["Lena", "€20.00", "Delivered", "Shout out Berlin watch party."]
              ].map(([name, amount, status, message]) => (
                <div key={`${name}-${amount}`} className="grid gap-2 px-3 py-3 sm:grid-cols-[90px_80px_92px_1fr]">
                  <span className="text-sm font-medium">{name}</span>
                  <span className="text-sm text-ember">{amount}</span>
                  <span className="text-xs text-white/48">{status}</span>
                  <span className="min-w-0 truncate text-sm text-white/62">{message}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#101010] p-4">
          <div className="rounded-md border border-line bg-black p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ember">OBS overlay</p>
            <div className="mt-4 rounded-md border border-ember/35 bg-[#16100c] p-4">
              <div className="flex items-center justify-between gap-3">
                <strong>Maya</strong>
                <span className="rounded-md bg-ember px-2 py-1 text-xs font-semibold text-black">$50</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/72">That clutch round was unreal. Run it back.</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-white/45">
              <span className="rounded-md border border-line bg-white/5 py-2">Goal +2%</span>
              <span className="rounded-md border border-line bg-white/5 py-2">Voice off</span>
              <span className="rounded-md border border-line bg-white/5 py-2">Sound on</span>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-line bg-black/30 p-3">
            <p className="text-sm font-medium">Webhook log</p>
            <div className="mt-3 space-y-2 font-mono text-xs text-white/48">
              <p>razorpay.payment.captured {"->"} dedupe ok</p>
              <p>paid-message.created {"->"} creator:nova</p>
              <p>dashboard.revenue.updated {"->"} 184ms</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden text-white">
      <SiteNav />
      <section className="border-b border-line px-5 pb-14 pt-28 md:pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-white/70">
              <RadioTower size={15} className="text-ember" />
              Paid live messages for independent creators
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-white md:text-5xl">
              Paid messages, delivered live.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/66 md:text-lg">
              ChatBoost handles guest payments, highlighted messages, OBS overlays, payout accounting, and admin review without locking creators into one streaming platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/login/creator">
                <LogIn size={18} />
                Create creator account
                <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="/@nova" variant="secondary">
                Preview payment page
              </ButtonLink>
            </div>
            <div className="mt-4 rounded-lg border border-white/12 bg-white/[0.06] p-4 text-sm text-white/66">
              <span className="font-semibold text-white">Creators start here:</span>{" "}
              <Link className="font-medium text-white hover:text-white/72" href="/login/creator">
                log in or create an account to get your viewer payment link.
              </Link>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-white/62 sm:grid-cols-3">
              {["10% platform fee", "Stripe and Razorpay adapters", "OBS browser source"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-mint" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <HeroConsole />
        </div>
      </section>

      <Section id="features" eyebrow="Platform" title="The parts that need to be boring are boring. The live moment is fast.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <div key={feature} className="surface rounded-lg p-5">
                <Icon className="text-ember" size={22} />
                <p className="mt-5 text-sm leading-7 text-white/72">{feature}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="Flow" title="One successful payment becomes one canonical realtime event.">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Viewer pays", "Viewer opens the creator share link and enters name, message, amount, and the best local payment method."],
            ["Webhook settles", "Provider webhook is verified, deduped, fee-calculated, moderated, and persisted."],
            ["Room updates", "Overlay, dashboard, analytics, activity, goal bars, and leaderboards update from the same event."]
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-line bg-[#111111] p-6">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-4 leading-7 text-white/62">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="pricing" eyebrow="Pricing" title="A fee model creators can explain without a calculator.">
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="surface rounded-lg p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ember">Platform fee</p>
            <strong className="mt-4 block text-5xl font-semibold">10%</strong>
            <p className="mt-4 leading-7 text-white/64">Gateway fees, taxes, refunds, chargebacks, and currency conversion are tracked separately from ChatBoost revenue.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Stripe", "Razorpay", "PayPal", "UPI", "Apple Pay", "Google Pay"].map((provider) => (
              <div key={provider} className="rounded-lg border border-line bg-[#111111] p-5 text-white/72">
                {provider}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Controls" title="Admin, fraud, and payout workflows are designed into the system.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [ShieldCheck, "Webhook signatures, idempotency keys, duplicate payment detection, RBAC, rate limits, and audit logs."],
            [Globe2, "Country-aware payment routing and multi-currency display for India, North America, Europe, Japan, Australia, and the UAE."],
            [Zap, "Redis-backed realtime rooms and queue-backed workers for moderation, receipts, analytics, and payouts."]
          ].map(([Icon, text]) => {
            const TypedIcon = Icon as typeof ShieldCheck;
            return (
              <div key={text as string} className="rounded-lg border border-line bg-[#111111] p-6">
                <TypedIcon className="text-aqua" size={22} />
                <p className="mt-4 leading-7 text-white/64">{text as string}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="Roadmap" title="Launch narrow, keep the integration surface open.">
        <div className="grid gap-3 md:grid-cols-5">
          {roadmap.map((item, index) => (
            <div key={item} className="rounded-lg border border-line bg-[#111111] p-4">
              <span className="text-sm text-ember">Phase {index + 1}</span>
              <p className="mt-3 font-medium">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <footer className="border-t border-line px-5 py-10 text-sm text-white/52">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row">
          <span>ChatBoost</span>
          <span>Paid live messages, realtime overlays, and payout accounting for creators.</span>
        </div>
      </footer>
    </main>
  );
}

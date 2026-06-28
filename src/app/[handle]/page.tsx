import Link from "next/link";
import { Activity, BadgeCheck, RadioTower, Users } from "lucide-react";
import { PaymentPanel } from "@/components/creator/payment-panel";
import { RecentBoosts } from "@/components/creator/recent-boosts";

export default async function CreatorPublicPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle: rawHandle } = await params;
  const handle = decodeURIComponent(rawHandle);

  return (
    <main className="min-h-screen px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-white text-black">CB</span>
          ChatBoost
        </Link>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="overflow-hidden rounded-lg border border-line bg-white/6">
            <div className="h-48 border-b border-line bg-[#111111]">
              <div className="grid h-full grid-cols-[1fr_160px] gap-px bg-line">
                <div className="bg-[#161616] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/38">Stream room</p>
                  <div className="mt-10 h-3 w-3/4 rounded-full bg-white/12" />
                  <div className="mt-3 h-3 w-1/2 rounded-full bg-white/8" />
                </div>
                <div className="bg-[#121212] p-5">
                  <div className="rounded-md border border-ember/30 bg-ember/10 p-3 text-sm text-ember">Live boost</div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="-mt-16 grid size-24 place-items-center rounded-lg border border-line bg-black text-3xl font-semibold shadow-panel">N</div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold tracking-normal">Nova Plays</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-mint/12 px-3 py-1 text-sm text-mint">
                  <BadgeCheck size={15} />
                  YouTube verified
                </span>
              </div>
              <p className="mt-2 text-white/56">{handle.startsWith("@") ? handle : `@${handle}`}</p>
              <p className="mt-5 max-w-2xl leading-7 text-white/70">
                Send a paid highlighted message to appear instantly on stream. Bigger boosts get stronger animations, voice reading, and leaderboard credit.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  [RadioTower, "Live now"],
                  [Users, "48K viewers"],
                  [Activity, "Sub-second overlay"]
                ].map(([Icon, label]) => {
                  const TypedIcon = Icon as typeof RadioTower;
                  return (
                    <div key={label as string} className="rounded-lg border border-line bg-black/24 p-4">
                      <TypedIcon className="text-ember" size={19} />
                      <p className="mt-3 text-sm text-white/70">{label as string}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold">Recent boosts</h2>
                <RecentBoosts />
              </div>
            </div>
          </div>

          <PaymentPanel />
        </section>
      </div>
    </main>
  );
}

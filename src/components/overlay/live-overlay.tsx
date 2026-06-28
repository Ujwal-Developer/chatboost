"use client";

import { useLiveBoosts } from "@/lib/client/live-boosts";

export function LiveOverlay({ creatorId }: { creatorId: string }) {
  const [featured, ...rest] = useLiveBoosts();

  return (
    <main className="min-h-screen overflow-hidden bg-transparent p-6 text-white">
      <div className="fixed bottom-6 left-6 w-[min(520px,calc(100vw-48px))]">
        <div className="rounded-lg border border-ember/45 bg-black/85 p-5" data-testid="live-overlay-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-ember">ChatBoost</p>
              <h1 className="mt-2 text-3xl font-semibold">{featured.name}</h1>
            </div>
            <strong className="rounded-lg bg-ember px-4 py-2 text-black">{featured.amountLabel}</strong>
          </div>
          <p className="mt-4 text-xl leading-8 text-white/84">{featured.message}</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-3/4 rounded-full bg-ember" />
          </div>
          <p className="mt-3 text-xs text-white/42">Room: creator:{creatorId}</p>
        </div>

        <div className="mt-3 space-y-2">
          {rest.slice(0, 2).map((item) => (
            <div key={item.id} className="rounded-lg border border-line bg-black/75 px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-ember">{item.amountLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

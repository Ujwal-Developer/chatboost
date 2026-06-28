"use client";

import { useLiveBoosts } from "@/lib/client/live-boosts";

export function RecentBoosts() {
  const boosts = useLiveBoosts();

  return (
    <div className="mt-4 space-y-3" data-testid="recent-boosts">
      {boosts.slice(0, 6).map((item) => (
        <div key={item.id} className="rounded-lg border border-line bg-black/28 p-4">
          <div className="flex items-center justify-between gap-3">
            <strong>{item.name}</strong>
            <span className="text-sm font-semibold text-ember">{item.amountLabel}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/64">{item.message}</p>
        </div>
      ))}
    </div>
  );
}

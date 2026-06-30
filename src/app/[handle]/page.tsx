import { notFound } from "next/navigation";
import { BadgeCheck, RadioTower } from "lucide-react";
import { BrandLink } from "@/components/brand/brand-logo";
import { PaymentPanel } from "@/components/creator/payment-panel";
import { RecentBoosts } from "@/components/creator/recent-boosts";
import { creatorPaymentPath, displayNameFromHandle, normalizeCreatorHandle } from "@/lib/creator";

export default async function CreatorPublicPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle: rawHandle } = await params;
  const decodedHandle = decodeURIComponent(rawHandle);

  if (!decodedHandle.startsWith("@")) {
    notFound();
  }

  const handle = normalizeCreatorHandle(decodedHandle);
  const creatorName = displayNameFromHandle(handle);
  const creatorHandle = creatorPaymentPath(handle);

  return (
    <main className="min-h-screen px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <BrandLink className="inline-flex text-white/75 hover:text-white" />

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,540px)_1fr] lg:items-start">
          <PaymentPanel creatorId={handle} creatorName={creatorName} creatorHandle={creatorHandle} />

          <div className="space-y-6">
            <section className="rounded-lg border border-line bg-white/[0.06] p-6">
              <div className="flex flex-wrap items-start gap-4">
                <div className="grid size-20 place-items-center rounded-lg border border-line bg-black text-3xl font-semibold shadow-panel">{creatorName.charAt(0)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-normal">{creatorName}</h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-mint/12 px-3 py-1 text-sm text-mint">
                      <BadgeCheck size={15} />
                      Creator verified
                    </span>
                  </div>
                  <p className="mt-2 text-white/56">{creatorHandle}</p>
                </div>
              </div>
              <p className="mt-5 leading-7 text-white/70">
                This is {creatorName}&apos;s payment link. Add your name, message, amount, and payment method to send a tip directly to the creator.
              </p>
              <div className="mt-5 rounded-lg border border-ember/25 bg-ember/10 p-4 text-sm leading-6 text-ember">
                <div className="flex items-center gap-2 font-semibold">
                  <RadioTower size={17} />
                  Live payment alert
                </div>
                <p className="mt-2 text-white/66">Successful tips appear in the creator dashboard and overlay feed.</p>
              </div>
            </section>

            <section className="rounded-lg border border-line bg-white/[0.06] p-6">
              <h2 className="text-xl font-semibold">Recent tips</h2>
              <RecentBoosts />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

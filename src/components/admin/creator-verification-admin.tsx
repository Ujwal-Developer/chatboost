"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ExternalLink, ShieldCheck, XCircle } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { creatorPaymentPath } from "@/lib/creator";
import { readManualReviewQueue, updateManualReviewRequest, type CreatorReviewRequest } from "@/lib/client/creator-profile";
import { platformLabels } from "@/lib/creator-verification";

export function CreatorVerificationAdmin() {
  const [requests, setRequests] = useState<CreatorReviewRequest[]>([]);
  const [selectedHandle, setSelectedHandle] = useState<string | null>(null);

  function refreshQueue() {
    setRequests(readManualReviewQueue());
  }

  useEffect(() => {
    refreshQueue();
  }, []);

  function review(handle: string, status: "verified" | "rejected") {
    updateManualReviewRequest(
      handle,
      status,
      status === "verified" ? "Admin confirmed public proof code, identity fields, and payout country." : "Admin rejected the proof. Creator must update channel proof and resubmit."
    );
    setSelectedHandle(handle);
    refreshQueue();
  }

  const pendingRequests = requests.filter((request) => request.verificationStatus === "in_review");
  const reviewedRequests = requests.filter((request) => request.verificationStatus !== "in_review");

  return (
    <AppShell title="Creator verification review">
      <section className="surface rounded-lg p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-ember">
              <ShieldCheck size={17} />
              Manual creator verification
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Review ownership proof before payments unlock</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
              Confirm the creator added the proof code to their public channel/profile, then approve the request. This review queue currently uses browser storage; production should store reviews in the database with admin audit logs.
            </p>
          </div>
          <span className="rounded-lg border border-line bg-black/30 px-3 py-2 text-sm text-white/62">{pendingRequests.length} pending</span>
        </div>
      </section>

      <div className="mt-6 grid gap-4">
        {pendingRequests.length === 0 ? (
          <section className="rounded-lg border border-line bg-white/[0.06] p-5">
            <h3 className="font-semibold">No pending creator reviews</h3>
            <p className="mt-2 text-sm leading-6 text-white/58">Submit a creator verification request first, then it will appear here for approval.</p>
          </section>
        ) : null}

        {pendingRequests.map((request) => (
          <section key={request.handle} className="rounded-lg border border-line bg-white/[0.06] p-5">
            <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold">{request.displayName}</h3>
                  <span className="rounded-full bg-ember/10 px-3 py-1 text-sm text-ember">In review</span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-white/64 md:grid-cols-2">
                  <p>
                    <span className="text-white/38">Email:</span> {request.email}
                  </p>
                  <p>
                    <span className="text-white/38">Handle:</span> @{request.handle}
                  </p>
                  <p>
                    <span className="text-white/38">Platform:</span> {platformLabels[request.platform]}
                  </p>
                  <p>
                    <span className="text-white/38">Submitted:</span> {new Date(request.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 rounded-lg border border-line bg-black/24 p-4">
                  <p className="text-sm text-white/38">Proof code to check publicly</p>
                  <p className="mt-2 font-mono text-sm text-ember">{request.proofCode}</p>
                  <p className="mt-3 text-sm text-white/38">Proof location</p>
                  <p className="mt-1 break-words text-sm text-white/64">{request.proofLocationUrl || request.channelUrl}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <ButtonLink href={request.channelUrl} variant="secondary">
                    <ExternalLink size={17} />
                    Open channel
                  </ButtonLink>
                  <ButtonLink href={request.proofLocationUrl || request.channelUrl} variant="secondary">
                    <ExternalLink size={17} />
                    Open proof URL
                  </ButtonLink>
                  <ButtonLink href={creatorPaymentPath(request.handle)} variant="secondary">
                    Preview payment page
                  </ButtonLink>
                </div>
              </div>

              <div className="rounded-lg border border-line bg-black/25 p-4">
                <h4 className="font-semibold">Admin decision</h4>
                <p className="mt-2 text-sm leading-6 text-white/54">Approve only after the public proof code is visible and the identity/payout fields look legitimate.</p>
                <div className="mt-4 grid gap-2">
                  <Button type="button" onClick={() => review(request.handle, "verified")}>
                    <BadgeCheck size={17} />
                    Approve creator
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => review(request.handle, "rejected")}>
                    <XCircle size={17} />
                    Reject proof
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {reviewedRequests.length > 0 ? (
        <section className="surface mt-6 rounded-lg p-5">
          <h3 className="text-xl font-semibold">Reviewed requests</h3>
          <div className="mt-4 grid gap-3">
            {reviewedRequests.map((request) => (
              <div key={`${request.handle}-${request.reviewedAt ?? request.submittedAt}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-black/24 p-3 text-sm">
                <span>
                  {request.displayName} / @{request.handle}
                </span>
                <span className={request.verificationStatus === "verified" ? "text-mint" : "text-ember"}>
                  {request.verificationStatus === "verified" ? "Approved" : "Rejected"}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {selectedHandle ? <p className="mt-4 rounded-lg border border-mint/25 bg-mint/10 p-3 text-sm text-mint">Review saved for @{selectedHandle}.</p> : null}
    </AppShell>
  );
}

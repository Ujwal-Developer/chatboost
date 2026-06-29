import { CreatorDashboardClient } from "@/components/dashboard/creator-dashboard-client";
import { defaultCreatorHandle, defaultCreatorName, normalizeCreatorHandle } from "@/lib/creator";

export default async function CreatorDashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ displayName?: string; handle?: string; email?: string }>;
}) {
  const params = await searchParams;
  const initialProfile = params
    ? {
        displayName: params.displayName?.trim() || defaultCreatorName,
        handle: normalizeCreatorHandle(params.handle ?? defaultCreatorHandle),
        email: params.email?.trim() || "creator@chatboost.local"
      }
    : undefined;

  return <CreatorDashboardClient initialProfile={initialProfile} />;
}

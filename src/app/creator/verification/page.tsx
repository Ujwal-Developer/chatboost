import { CreatorVerificationClient } from "@/components/creator/creator-verification-client";

export default async function CreatorVerificationPage({
  searchParams
}: {
  searchParams?: Promise<{ displayName?: string; handle?: string; email?: string; platform?: string; channelUrl?: string; auth?: string }>;
}) {
  const params = await searchParams;

  return <CreatorVerificationClient initialProfile={params} />;
}

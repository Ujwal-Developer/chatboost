import { LiveOverlay } from "@/components/overlay/live-overlay";

export default async function OverlayPage({ params }: { params: Promise<{ creatorId: string }> }) {
  const { creatorId } = await params;
  return <LiveOverlay creatorId={creatorId} />;
}

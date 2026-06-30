import { CreatorVerificationAdmin } from "@/components/admin/creator-verification-admin";
import { requireAdminAccess } from "@/lib/auth/admin";

export default async function AdminCreatorVerificationPage() {
  await requireAdminAccess();

  return <CreatorVerificationAdmin />;
}

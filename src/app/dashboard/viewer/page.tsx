import { redirect } from "next/navigation";

export default function ViewerDashboardRedirect() {
  redirect("/login/creator");
}

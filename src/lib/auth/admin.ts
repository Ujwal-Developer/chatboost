import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/config";

const adminCookieName = "chatboost.admin";

export async function hasAdminAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;
  return Boolean(env.ADMIN_ACCESS_KEY && token === env.ADMIN_ACCESS_KEY);
}

export async function requireAdminAccess() {
  if (!(await hasAdminAccess())) {
    redirect("/admin/login");
  }
}

export async function setAdminAccessCookie(value: string) {
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8
  });
}

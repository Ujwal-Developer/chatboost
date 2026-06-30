import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/config";
import { setAdminAccessCookie } from "@/lib/auth/admin";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const accessKey = String(form.get("accessKey") ?? "");

  if (!env.ADMIN_ACCESS_KEY) {
    return NextResponse.redirect(new URL("/admin/login?error=missing-admin-key", request.url));
  }

  if (accessKey !== env.ADMIN_ACCESS_KEY) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url));
  }

  await setAdminAccessCookie(accessKey);
  return NextResponse.redirect(new URL("/admin", request.url));
}

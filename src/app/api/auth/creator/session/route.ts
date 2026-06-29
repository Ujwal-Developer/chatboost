import { NextResponse } from "next/server";
import { readCreatorOAuthSession } from "@/lib/auth/creator-oauth";
import { env } from "@/lib/config";

export async function GET() {
  const session = await readCreatorOAuthSession();

  return NextResponse.json({
    mode: env.YOUTUBE_CLIENT_ID && env.YOUTUBE_CLIENT_SECRET && env.AUTH_SECRET ? "real" : "demo",
    authenticated: Boolean(session),
    session
  });
}

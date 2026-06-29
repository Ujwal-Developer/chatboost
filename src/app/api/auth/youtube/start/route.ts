import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { env } from "@/lib/config";

const scopes = ["openid", "email", "profile", "https://www.googleapis.com/auth/youtube.readonly"];

export async function GET() {
  if (!env.YOUTUBE_CLIENT_ID || !env.YOUTUBE_CLIENT_SECRET || !env.AUTH_SECRET) {
    return NextResponse.redirect(new URL("/creator/verification?auth=missing-youtube-env", env.NEXT_PUBLIC_APP_URL));
  }

  const state = randomBytes(24).toString("hex");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", env.YOUTUBE_CLIENT_ID);
  url.searchParams.set("redirect_uri", `${env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  response.cookies.set("chatboost.oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NEXT_PUBLIC_APP_URL.startsWith("https://"),
    maxAge: 10 * 60,
    path: "/"
  });

  return response;
}

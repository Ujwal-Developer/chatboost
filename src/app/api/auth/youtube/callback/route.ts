import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { creatorOAuthCookie, creatorSessionFromYouTube, signCreatorOAuthSession } from "@/lib/auth/creator-oauth";
import { env } from "@/lib/config";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleUserInfo = {
  email?: string;
  name?: string;
  picture?: string;
};

type YouTubeChannelsResponse = {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      customUrl?: string;
    };
  }>;
};

function fail(reason: string, origin: string) {
  return NextResponse.redirect(new URL(`/creator/verification?auth=${encodeURIComponent(reason)}`, origin));
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  if (!env.YOUTUBE_CLIENT_ID || !env.YOUTUBE_CLIENT_SECRET || !env.AUTH_SECRET) {
    return fail("missing-youtube-env", origin);
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = (await cookies()).get("chatboost.oauth_state")?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return fail("invalid-oauth-state", origin);
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.YOUTUBE_CLIENT_ID,
      client_secret: env.YOUTUBE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${origin}/api/auth/youtube/callback`
    })
  });
  const tokenPayload = (await tokenResponse.json()) as GoogleTokenResponse;

  if (!tokenResponse.ok || !tokenPayload.access_token) {
    return fail(tokenPayload.error ?? "token-exchange-failed", origin);
  }

  const [userInfoResponse, channelsResponse] = await Promise.all([
    fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { authorization: `Bearer ${tokenPayload.access_token}` }
    }),
    fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
      headers: { authorization: `Bearer ${tokenPayload.access_token}` }
    })
  ]);

  const userInfo = (await userInfoResponse.json()) as GoogleUserInfo;
  const channels = (await channelsResponse.json()) as YouTubeChannelsResponse;
  const channel = channels.items?.[0];

  if (!userInfoResponse.ok || !channelsResponse.ok || !userInfo.email || !channel?.id) {
    return fail("youtube-channel-not-found", origin);
  }

  const creatorSession = creatorSessionFromYouTube({
    email: userInfo.email,
    name: userInfo.name ?? channel.snippet?.title ?? "YouTube Creator",
    avatarUrl: userInfo.picture,
    channelId: channel.id,
    channelTitle: channel.snippet?.title ?? "YouTube Channel",
    channelHandle: channel.snippet?.customUrl
  });
  const token = await signCreatorOAuthSession(creatorSession);
  const response = NextResponse.redirect(new URL("/creator/verification?auth=youtube-connected", origin));

  response.cookies.set(creatorOAuthCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: origin.startsWith("https://"),
    maxAge: 7 * 24 * 60 * 60,
    path: "/"
  });
  response.cookies.delete("chatboost.oauth_state");

  return response;
}

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { env } from "@/lib/config";
import { creatorProofCode } from "@/lib/creator-verification";
import { normalizeCreatorHandle } from "@/lib/creator";

export const creatorOAuthCookie = "chatboost.creator_oauth";
const encoder = new TextEncoder();

export type CreatorOAuthSession = {
  provider: "youtube";
  email: string;
  name: string;
  avatarUrl?: string;
  channelId: string;
  channelTitle: string;
  channelHandle: string;
  channelUrl: string;
  handle: string;
  proofCode: string;
  verifiedAt: string;
};

function requireAuthSecret() {
  if (!env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is required for real creator authentication.");
  }

  return encoder.encode(env.AUTH_SECRET);
}

export async function signCreatorOAuthSession(session: CreatorOAuthSession) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("chatboost")
    .setSubject(session.channelId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(requireAuthSecret());
}

export async function readCreatorOAuthSession(): Promise<CreatorOAuthSession | null> {
  if (!env.AUTH_SECRET) return null;

  const token = (await cookies()).get(creatorOAuthCookie)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, encoder.encode(env.AUTH_SECRET), { issuer: "chatboost" });
    return verified.payload as CreatorOAuthSession;
  } catch {
    return null;
  }
}

export function creatorSessionFromYouTube(input: {
  email: string;
  name: string;
  avatarUrl?: string;
  channelId: string;
  channelTitle: string;
  channelHandle?: string;
}) {
  const channelHandle = input.channelHandle?.startsWith("@") ? input.channelHandle : input.channelHandle ? `@${input.channelHandle}` : `@${input.channelId}`;
  const handle = normalizeCreatorHandle(channelHandle);

  return {
    provider: "youtube" as const,
    email: input.email,
    name: input.name || input.channelTitle,
    avatarUrl: input.avatarUrl,
    channelId: input.channelId,
    channelTitle: input.channelTitle,
    channelHandle,
    channelUrl: `https://www.youtube.com/channel/${input.channelId}`,
    handle,
    proofCode: creatorProofCode(handle),
    verifiedAt: new Date().toISOString()
  };
}

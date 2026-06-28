import type { StreamingPlatformAdapter } from "./types";

export const youtubeAdapter: StreamingPlatformAdapter = {
  key: "youtube",
  connectUrl: (creatorId) => `/api/streaming/youtube/connect?creatorId=${creatorId}`,
  verifyOwnership: async (code) => ({
    verified: code.trim().length > 8,
    externalChannelId: code.trim().length > 8 ? `yt_${code.slice(0, 8)}` : undefined,
    channelUrl: code.trim().length > 8 ? "https://youtube.com/@connected-channel" : undefined,
    reason: code.trim().length > 8 ? undefined : "Verification code is too short."
  })
};

export const futurePlatformAdapters: StreamingPlatformAdapter[] = [
  youtubeAdapter,
  { key: "twitch", connectUrl: (creatorId) => `/api/streaming/twitch/connect?creatorId=${creatorId}`, verifyOwnership: async () => ({ verified: false, reason: "Coming soon" }) },
  { key: "kick", connectUrl: (creatorId) => `/api/streaming/kick/connect?creatorId=${creatorId}`, verifyOwnership: async () => ({ verified: false, reason: "Coming soon" }) },
  { key: "facebook_gaming", connectUrl: (creatorId) => `/api/streaming/facebook/connect?creatorId=${creatorId}`, verifyOwnership: async () => ({ verified: false, reason: "Coming soon" }) },
  { key: "tiktok_live", connectUrl: (creatorId) => `/api/streaming/tiktok/connect?creatorId=${creatorId}`, verifyOwnership: async () => ({ verified: false, reason: "Coming soon" }) },
  { key: "discord_stage", connectUrl: (creatorId) => `/api/streaming/discord/connect?creatorId=${creatorId}`, verifyOwnership: async () => ({ verified: false, reason: "Coming soon" }) },
  { key: "custom_rtmp", connectUrl: (creatorId) => `/api/streaming/custom-rtmp/connect?creatorId=${creatorId}`, verifyOwnership: async () => ({ verified: true }) }
];

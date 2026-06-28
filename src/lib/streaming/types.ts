export type StreamPlatformKey = "youtube" | "twitch" | "kick" | "facebook_gaming" | "tiktok_live" | "discord_stage" | "custom_rtmp";

export type ChannelVerification = {
  verified: boolean;
  externalChannelId?: string;
  channelUrl?: string;
  reason?: string;
};

export interface StreamingPlatformAdapter {
  key: StreamPlatformKey;
  connectUrl(creatorId: string): string;
  verifyOwnership(code: string): Promise<ChannelVerification>;
}

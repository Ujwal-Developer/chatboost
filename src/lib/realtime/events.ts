import type { SupportedCurrency } from "@/lib/domain/currency";

export type ChatBoostRealtimeEvent =
  | {
      type: "paid-message.created";
      creatorId: string;
      messageId: string;
      displayName: string;
      message: string;
      amount: number;
      currency: SupportedCurrency;
      color: string;
      createdAt: string;
    }
  | {
      type: "dashboard.revenue.updated";
      creatorId: string;
      liveRevenue: number;
      availableBalance: number;
      pendingBalance: number;
      currency: SupportedCurrency;
    }
  | {
      type: "moderation.message.flagged";
      creatorId: string;
      messageId: string;
      reason: string;
    };

export function creatorRoom(creatorId: string) {
  return `creator:${creatorId}`;
}

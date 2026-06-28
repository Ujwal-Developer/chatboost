import { z } from "zod";
import { supportedCurrencies } from "@/lib/domain/currency";

export const paidMessageSchema = z.object({
  creatorId: z.string().min(3),
  viewerId: z.string().optional(),
  displayName: z.string().trim().min(2).max(40),
  message: z.string().trim().min(1).max(240),
  amount: z.number().int().min(100).max(500_000),
  currency: z.enum(supportedCurrencies),
  countryCode: z.string().length(2).optional(),
  provider: z.enum(["stripe", "razorpay", "paypal", "upi"]).optional()
});

export type PaidMessageInput = z.infer<typeof paidMessageSchema>;

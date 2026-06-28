const blockedTerms = ["scam link", "hate speech", "chargeback fraud"];

export type ModerationDecision = {
  status: "APPROVED" | "FLAGGED" | "REJECTED";
  score: number;
  reason?: string;
};

export async function moderatePaidMessage(message: string): Promise<ModerationDecision> {
  const normalized = message.toLowerCase();
  const match = blockedTerms.find((term) => normalized.includes(term));

  if (match) {
    return {
      status: "FLAGGED",
      score: 88,
      reason: `Potential policy risk: ${match}`
    };
  }

  return { status: "APPROVED", score: 8 };
}

export function buildAutoThankYou(displayName: string, amountLabel: string) {
  return `Thanks ${displayName} for the ${amountLabel} boost.`;
}

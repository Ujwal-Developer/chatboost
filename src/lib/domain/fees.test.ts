import { describe, expect, it } from "vitest";
import { calculateFeeBreakdown } from "./fees";

describe("calculateFeeBreakdown", () => {
  it("keeps approximately 90 percent for the creator before gateway costs", () => {
    const result = calculateFeeBreakdown({ grossAmount: 10_000 });

    expect(result.platformFee).toBe(1000);
    expect(result.netCreatorEarnings).toBe(9000);
  });

  it("subtracts gateway fees and tax from creator earnings", () => {
    const result = calculateFeeBreakdown({
      grossAmount: 10_000,
      gatewayFeeBps: 300,
      fixedGatewayFee: 30,
      taxBps: 1800
    });

    expect(result.platformFee).toBe(1000);
    expect(result.gatewayFee).toBe(330);
    expect(result.taxes).toBe(180);
    expect(result.netCreatorEarnings).toBe(8490);
  });
});

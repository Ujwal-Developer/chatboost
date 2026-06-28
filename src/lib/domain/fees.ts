export type FeeBreakdown = {
  grossAmount: number;
  platformFee: number;
  gatewayFee: number;
  taxes: number;
  netCreatorEarnings: number;
};

export type FeeInput = {
  grossAmount: number;
  platformFeeBps?: number;
  gatewayFeeBps?: number;
  fixedGatewayFee?: number;
  taxBps?: number;
};

const DEFAULT_PLATFORM_FEE_BPS = 1000;

export function calculateFeeBreakdown(input: FeeInput): FeeBreakdown {
  const platformFeeBps = input.platformFeeBps ?? DEFAULT_PLATFORM_FEE_BPS;
  const gatewayFeeBps = input.gatewayFeeBps ?? 0;
  const fixedGatewayFee = input.fixedGatewayFee ?? 0;
  const taxBps = input.taxBps ?? 0;

  const platformFee = Math.round((input.grossAmount * platformFeeBps) / 10_000);
  const gatewayFee = Math.round((input.grossAmount * gatewayFeeBps) / 10_000) + fixedGatewayFee;
  const taxes = Math.round((platformFee * taxBps) / 10_000);
  const netCreatorEarnings = Math.max(0, input.grossAmount - platformFee - gatewayFee - taxes);

  return {
    grossAmount: input.grossAmount,
    platformFee,
    gatewayFee,
    taxes,
    netCreatorEarnings
  };
}

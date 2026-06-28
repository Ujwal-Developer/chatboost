export const supportedCurrencies = ["INR", "USD", "EUR", "GBP", "AUD", "CAD", "JPY", "AED"] as const;
export type SupportedCurrency = (typeof supportedCurrencies)[number];

const countryCurrency: Record<string, SupportedCurrency> = {
  IN: "INR",
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  AU: "AUD",
  JP: "JPY",
  AE: "AED",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR"
};

export function currencyForCountry(countryCode?: string | null): SupportedCurrency {
  if (!countryCode) return "USD";
  return countryCurrency[countryCode.toUpperCase()] ?? "USD";
}

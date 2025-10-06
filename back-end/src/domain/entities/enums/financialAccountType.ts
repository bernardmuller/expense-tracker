const financialAccountType = {
  bank: "bank",
  crypto: "crypto",
} as const;

export type FinancialAccountType = typeof financialAccountType;

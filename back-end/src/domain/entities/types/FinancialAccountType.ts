const financialAccountType = {
  bank: "bank",
  crypto: "crypto"
} as const;

export type FinancialAccount = typeof financialAccountType;

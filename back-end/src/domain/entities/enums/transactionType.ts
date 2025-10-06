export const transactionType = {
  expense: "expense",
  income: "income",
  transfer: "transfer",
} as const;

export type TransactionType = keyof typeof transactionType;

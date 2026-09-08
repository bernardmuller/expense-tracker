import { createError } from "@/lib/utils/createError";

export const InvalidTransactionAmountError = createError(
  "InvalidTransactionAmountError",
  (amount: number) => `Invalid transaction amount: ${amount}`,
  {
    code: "INVALID_TRANSACTION_AMOUNT",
    error: "Unprocessable Entity",
    statusCode: 422,
  },
);

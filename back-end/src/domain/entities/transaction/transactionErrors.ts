import { createError } from "@/lib/utils/createError";

export const InvalidTransactionUpdateError = createError(
  "InvalidTransactionUpdateError",
  (reason: string) => `Invalid transaction update: ${reason}`,
  {
    code: "INVALID_TRANSACTION_UPDATE",
    error: "Bad Request",
    statusCode: 400,
  },
);

export type TransactionError = InstanceType<
  typeof InvalidTransactionUpdateError
>;

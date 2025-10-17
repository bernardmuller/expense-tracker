import { createError } from "@/lib/utils/createError";

export const InvalidTransactionUpdateError = createError(
  "InvalidTransactionUpdateError",
  (reason: string) => `Invalid transaction update: ${reason}`,
);

export type TransactionError = InstanceType<
  typeof InvalidTransactionUpdateError
>;

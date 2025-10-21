import { createError } from "@/lib/utils/createError";

export const InvalidAllocatedAmountError = createError<
  "InvalidAllocatedAmountError",
  number
>(
  "InvalidAllocatedAmountError",
  (amount) => `Invalid allocated amount: ${amount}`,
  {
    code: "INVALID_ALLOCATED_AMOUNT",
    error: "Bad Request",
    statusCode: 400,
  },
);

export type CategoryBudgetError = InstanceType<
  typeof InvalidAllocatedAmountError
>;

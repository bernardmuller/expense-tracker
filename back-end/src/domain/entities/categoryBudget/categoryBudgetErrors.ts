import { createError } from "@/lib/utils/createError";

export const InvalidAllocatedAmountError = createError<
  "InvalidAllocatedAmountError",
  number
>(
  "InvalidAllocatedAmountError",
  (amount) => `Invalid allocated amount: ${amount}`,
);

export type CategoryBudgetError = InstanceType<
  typeof InvalidAllocatedAmountError
>;

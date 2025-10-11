import { createError } from "@/lib/utils/createError";

export const InvalidAllocatedAmountError = createError<
  "InvalidAllocatedAmountError",
  number
>(
  "InvalidAllocatedAmountError",
  (amount) => `Invalid allocated amount: ${amount}`,
);

export type CategoryBudgetValidationError = InstanceType<
  typeof InvalidAllocatedAmountError
>;

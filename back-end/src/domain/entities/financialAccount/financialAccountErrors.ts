import { createError } from "@/lib/utils/createError";

export const InvalidFinancialAccountNameError = createError(
  "InvalidFinancialAccountNameError",
  (accountName: string) => `Invalid financial account name: ${accountName}`,
);

export const InvalidCurrentAmountError = createError<
  "InvalidCurrentAmountError",
  number
>("InvalidCurrentAmountError", (amount) => `Invalid current amount: ${amount}`);

export const FinancialAccountTypeAlreadySetError = createError(
  "FinancialAccountTypeAlreadySetError",
  (type: string) => `Financial account type is already set: ${type}`,
);

export const InvalidSubtractionAmountError = createError<
  "InvalidSubtractionAmountError",
  number
>(
  "InvalidSubtractionAmountError",
  (amount) => `Invalid subtraction amount: ${amount}`,
);

export const InvalidAdditionAmountError = createError<
  "InvalidAdditionAmountError",
  number
>(
  "InvalidAdditionAmountError",
  (amount) => `Invalid addition amount: ${amount}`,
);

export type FinancialAccountValidationError =
  | InstanceType<typeof InvalidFinancialAccountNameError>
  | InstanceType<typeof FinancialAccountTypeAlreadySetError>
  | InstanceType<typeof InvalidAdditionAmountError>
  | InstanceType<typeof InvalidSubtractionAmountError>
  | InstanceType<typeof InvalidCurrentAmountError>;

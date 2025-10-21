import { createError } from "@/lib/utils/createError";

export const InvalidFinancialAccountNameError = createError(
  "InvalidFinancialAccountNameError",
  (accountName: string) => `Invalid financial account name: ${accountName}`,
  {
    code: "INVALID_FINANCIAL_ACCOUNT_NAME",
    error: "Bad Request",
    statusCode: 400,
  },
);

export const InvalidCurrentAmountError = createError<
  "InvalidCurrentAmountError",
  number
>(
  "InvalidCurrentAmountError",
  (amount) => `Invalid current amount: ${amount}`,
  {
    code: "INVALID_CURRENT_AMOUNT",
    error: "Bad Request",
    statusCode: 400,
  },
);

export const FinancialAccountTypeAlreadySetError = createError(
  "FinancialAccountTypeAlreadySetError",
  (type: string) => `Financial account type is already set: ${type}`,
  {
    code: "FINANCIAL_ACCOUNT_TYPE_ALREADY_SET",
    error: "Conflict",
    statusCode: 409,
  },
);

export const InvalidSubtractionAmountError = createError<
  "InvalidSubtractionAmountError",
  number
>(
  "InvalidSubtractionAmountError",
  (amount) => `Invalid subtraction amount: ${amount}`,
  {
    code: "INVALID_SUBTRACTION_AMOUNT",
    error: "Bad Request",
    statusCode: 400,
  },
);

export const InvalidAdditionAmountError = createError<
  "InvalidAdditionAmountError",
  number
>(
  "InvalidAdditionAmountError",
  (amount) => `Invalid addition amount: ${amount}`,
  {
    code: "INVALID_ADDITION_AMOUNT",
    error: "Bad Request",
    statusCode: 400,
  },
);

export type FinancialAccountValidationError =
  | InstanceType<typeof InvalidFinancialAccountNameError>
  | InstanceType<typeof FinancialAccountTypeAlreadySetError>
  | InstanceType<typeof InvalidAdditionAmountError>
  | InstanceType<typeof InvalidSubtractionAmountError>
  | InstanceType<typeof InvalidCurrentAmountError>;

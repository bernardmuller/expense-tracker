import { createError } from "@/lib/utils/createError";

export const InvalidStartAmountError = createError<
  "InvalidStartAmountError",
  number
>(
  "InvalidStartAmountError",
  (amount) => `Invalid start amount: ${amount}`,
  {
    code: "INVALID_START_AMOUNT",
    error: "Bad Request",
    statusCode: 400,
  },
);

export const BudgetAlreadyActiveError = createError(
  "BudgetAlreadyActiveError",
  (budgetId: string) => `Budget ${budgetId} is already active`,
  {
    code: "BUDGET_ALREADY_ACTIVE",
    error: "Conflict",
    statusCode: 409,
  },
);

export const BudgetAlreadyInActiveError = createError(
  "BudgetAlreadyInActiveError",
  (budgetId: string) => `Budget ${budgetId} is already inactive`,
  {
    code: "BUDGET_ALREADY_INACTIVE",
    error: "Conflict",
    statusCode: 409,
  },
);

export const InvalidBudgetNameError = createError(
  "InvalidBudgetNameError",
  (budgetName: string) => `Invalid budget name: ${budgetName}`,
  {
    code: "INVALID_BUDGET_NAME",
    error: "Bad Request",
    statusCode: 400,
  },
);

export const BudgetNotFoundError = createError(
  "BudgetNotFoundError",
  (id: string) => `Budget not found: ${id}`,
  {
    code: "BUDGET_NOT_FOUND",
    error: "Not Found",
    statusCode: 404,
  },
);

export const BudgetNotActiveError = createError(
  "BudgetNotActiveError",
  (id: string) => `Budget ${id} is not active`,
  {
    code: "BUDGET_NOT_ACTIVE",
    error: "Conflict",
    statusCode: 409,
  },
);

export type BudgetValidationError =
  | InstanceType<typeof InvalidStartAmountError>
  | InstanceType<typeof InvalidBudgetNameError>;

export type BudgetError =
  | InstanceType<typeof BudgetAlreadyActiveError>
  | InstanceType<typeof BudgetAlreadyInActiveError>
  | InstanceType<typeof BudgetNotActiveError>
  | InstanceType<typeof BudgetNotFoundError>;

import { createError } from "@/lib/utils/createError";

export const InvalidStartAmountError = createError<
  "InvalidStartAmountError",
  number
>("InvalidStartAmountError", (amount) => `Invalid start amount: ${amount}`);

export const BudgetAlreadyActiveError = createError(
  "BudgetAlreadyActiveError",
  (budgetId: string) => `Budget ${budgetId} is already active`,
);

export const BudgetAlreadyInActiveError = createError(
  "BudgetAlreadyInActiveError",
  (budgetId: string) => `Budget ${budgetId} is already inactive`,
);

export const InvalidBudgetNameError = createError(
  "InvalidBudgetNameError",
  (budgetName: string) => `Invalid budget name: ${budgetName}`,
);

export const BudgetNotFoundError = createError(
  "BudgetNotFoundError",
  (id: string) => `Budget not found: ${id}`,
);

export const BudgetNotActiveError = createError(
  "BudgetNotActiveError",
  (id: string) => `Budget ${id} is not active`,
);

export type BudgetValidationError =
  | InstanceType<typeof InvalidStartAmountError>
  | InstanceType<typeof InvalidBudgetNameError>;

export type BudgetError =
  | InstanceType<typeof BudgetAlreadyActiveError>
  | InstanceType<typeof BudgetAlreadyInActiveError>
  | InstanceType<typeof BudgetNotActiveError>
  | InstanceType<typeof BudgetNotFoundError>;

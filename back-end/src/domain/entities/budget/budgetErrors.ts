export class InvalidStartAmountError extends Error {
  readonly _tag = "InvalidStartAmountError";
  constructor(public amount: number) {
    super(`Invalid start amount: ${amount}`);
    this.name = "InvalidStartAmountError";
  }
}

export class BudgetAlreadyActiveError extends Error {
  readonly _tag = "BudgetAlreadyActiveError";
  constructor(public budgetId: string) {
    super(`Budget ${budgetId} is already active`);
    this.name = "BudgetAlreadyActiveError";
  }
}

export class BudgetAlreadyInActiveError extends Error {
  readonly _tag = "BudgetAlreadyInActiveError";
  constructor(public budgetId: string) {
    super(`Budget ${budgetId} is already inactive`);
    this.name = "BudgetAlreadyInActiveError";
  }
}

export class InvalidBudgetNameError extends Error {
  readonly _tag = "InvalidBudgetNameError";
  constructor(public budgetName: string) {
    super(`Invalid budget name: ${budgetName}`);
    this.name = "InvalidBudgetNameError";
  }
}

export class BudgetNotFoundError extends Error {
  readonly _tag = "BudgetNotFoundError";
  constructor(public id: string) {
    super(`Budget not found: ${id}`);
    this.name = "BudgetNotFoundError";
  }
}

export class BudgetNotActiveError extends Error {
  readonly _tag = "BudgetNotActiveError";
  constructor(public id: string) {
    super(`Budget ${id} is not active`);
    this.name = "BudgetNotActiveError";
  }
}

export type BudgetValidationError =
  | InvalidStartAmountError
  | InvalidBudgetNameError;

export type BudgetError =
  | BudgetAlreadyActiveError
  | BudgetAlreadyInActiveError
  | BudgetNotActiveError
  | BudgetNotFoundError;

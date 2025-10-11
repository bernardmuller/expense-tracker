export class InvalidAllocatedAmountError extends Error {
  readonly _tag = "InvalidAllocatedAmountError";
  constructor(public amount: number) {
    super(`Invalid allocated amount: ${amount}`);
    this.name = "InvalidAllocatedAmountError";
  }
}

export type CategoryBudgetValidationError = InvalidAllocatedAmountError;
